import fs from "fs";

const OWNER = "PretFellowship";
const REPO = "pretfellowship.github.io";

async function fetchIssues() {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return await res.json();
}

function hasLabel(issue, labelName) {
  return issue.labels?.some((l) => l.name === labelName);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getField(body, label) {
  const escapedLabel = escapeRegExp(label);
  const headingRegex = new RegExp(
    `^#{2,6}\\s*${escapedLabel}\\s*$([\\s\\S]*?)(?=^#{2,6}\\s|$)`,
    'm'
  );

  const headingMatch = body.match(headingRegex);
  if (headingMatch) {
    return headingMatch[1].trim();
  }

  const colonRegex = new RegExp(
    `^${escapedLabel}:\\s*([\\s\\S]*?)(?=^\\w.*?:\\s|$)`,
    'm'
  );
  const colonMatch = body.match(colonRegex);
  return colonMatch ? colonMatch[1].trim() : null;
}

function parseIssue(issue) {
  const body = issue.body || "";

  const id =
    getField(body, "Event ID") ||
    issue.title.replace("[Event]:", "").trim().toLowerCase().replace(/\s+/g, "-");

  const tagsRaw = getField(body, "Tags");

  const event = {
    id,
    title: getField(body, "Title"),
    description: getField(body, "Description"),
    startDate: getField(body, "Start Date (ISO 8601)"),
    endDate: getField(body, "End Date (ISO 8601)"),
    locationType: getField(body, "Location Type"),
    locationText: getField(body, "Location Description"),

    latitude: parseFloat(getField(body, "Latitude (required for in-person or hybrid)")),
    longitude: parseFloat(getField(body, "Longitude (required for in-person or hybrid)")),

    url: getField(body, "Event URL") || null,

    tags: tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [],

    featured: getField(body, "Featured Event?") === "true",

    createdAt: issue.created_at,

    // internal
    _updatedAt: issue.updated_at,
    _source: issue.html_url,
  };

  // Normalize NaN → null
  if (isNaN(event.latitude)) event.latitude = null;
  if (isNaN(event.longitude)) event.longitude = null;

  return event;
}

function isValidISODate(str) {
  if (!str) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

function validateEvent(e) {
  const errors = [];

  const requiredFields = [
    "id",
    "title",
    "description",
    "startDate",
    "endDate",
    "locationType",
    "locationText",
  ];

  requiredFields.forEach((field) => {
    if (!e[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  if (!Array.isArray(e.tags) || e.tags.length === 0) {
    errors.push("Tags must be a non-empty array");
  }

  if (typeof e.featured !== "boolean") {
    errors.push("Featured must be boolean");
  }

  if (!isValidISODate(e.startDate)) {
    errors.push("Invalid startDate format (must be ISO 8601)");
  }

  if (!isValidISODate(e.endDate)) {
    errors.push("Invalid endDate format (must be ISO 8601)");
  }

  const validLocationTypes = ["in_person", "online", "hybrid", "historical"];
  if (!validLocationTypes.includes(e.locationType)) {
    errors.push(`Invalid locationType: ${e.locationType}`);
  }

  // Conditional lat/lng requirement
  if (["in_person", "hybrid"].includes(e.locationType)) {
    if (e.latitude === null || e.longitude === null) {
      errors.push("Latitude and Longitude required for in_person or hybrid events");
    }
  }

  return errors;
}

async function main() {
  const issues = await fetchIssues();

  const approved = issues
    .filter((i) => hasLabel(i, "approved"))
    .filter((i) => !hasLabel(i, "rejected"));

  const validEvents = [];
  const seen = new Map();

  for (const issue of approved) {
    const event = parseIssue(issue);
    const errors = validateEvent(event);

    if (errors.length > 0) {
      console.log(`Skipping issue #${issue.number} (${event.id}):`);
      errors.forEach((e) => console.log("  - " + e));
      continue;
    }

    // Deduplicate (latest wins)
    const existing = seen.get(event.id);
    if (
      !existing ||
      new Date(event._updatedAt) > new Date(existing._updatedAt)
    ) {
      seen.set(event.id, event);
    }
  }

  const events = Array.from(seen.values())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map(({ _updatedAt, _source, ...clean }) => clean);

  const output = {
    updatedAt: new Date().toISOString(),
    count: events.length,
    events,
  };

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync("data/submitted.json", JSON.stringify(output, null, 2));

  console.log(`Built data/submitted.json with ${events.length} valid approved events`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});