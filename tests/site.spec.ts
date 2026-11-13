import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
});

const go = async (page: import("@playwright/test").Page, path: string) => {
  await page.goto(`/#${path}`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
};

test("loads the portfolio without application errors and navigates between pages", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(
    page.getByRole("heading", { name: "Dylan Kwok.", level: 1 }),
  ).toBeVisible();
  await expect(page.locator(".hero-image")).toHaveJSProperty("complete", true);

  // Home directory links to each chapter
  await expect(page.getByRole("heading", { name: "Pick a chapter." })).toBeVisible();
  await expect(page.locator(".directory-card")).toHaveCount(5);

  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/#\/projects$/);
  await expect(
    page.getByRole("heading", { name: "From flight hardware to software." }),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Experience" })
    .click();
  await expect(page).toHaveURL(/#\/experience$/);
  await expect(
    page.getByRole("heading", { name: /Five roles/, level: 1 }),
  ).toBeVisible();
  const experience = page.locator("#experience");
  await expect(experience.locator(".experience-entry")).toHaveCount(5);
  await expect(experience).toContainText("Untitled Rocketry");
  await expect(experience).toContainText("Irvington Driving Force");
  await expect(experience).toContainText("MakerCubed CubeSat Project");
  await expect(experience).toContainText("Fremont Student Makers");
  await expect(experience).toContainText("Irvington Maker Club");
  await expect(experience).not.toContainText("AIAA Student Branch");

  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Field notes" })
    .click();
  await expect(page).toHaveURL(/#\/notes$/);
  await expect(
    page.getByRole("heading", { name: "Notes from the ground." }),
  ).toBeVisible();

  // Section shortcuts on sub-pages
  await page.getByRole("navigation", { name: "Other sections" }).getByRole("link", { name: /Atlas/ }).click();
  await expect(page).toHaveURL(/#\/atlas$/);
  await expect(page.getByRole("heading", { name: "A world worth crossing." })).toBeVisible();

  // Unknown route redirects home
  await page.goto("/#/does-not-exist", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/#\/$/);
  expect(errors).toEqual([]);
});

test("opens the printable resume and serves a real PDF", async ({ page }) => {
  await page.getByRole("button", { name: "Open résumé" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Dylan Kwok", level: 2 }),
  ).toBeVisible();
  await expect(dialog.getByText("EXPERIENCE & TEAMS")).toBeVisible();
  await expect(dialog.locator(".resume-job")).toHaveCount(5);
  await expect(dialog).toContainText("Untitled Rocketry");
  await expect(dialog).toContainText("MakerCubed CubeSat Project");
  await expect(dialog).not.toContainText("GPA");
  await expect(dialog).not.toContainText("Dean's List");
  const pdf = await page.request.get("/documents/dylan-kwok-resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("pdf");
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  await expect(
    dialog.getByRole("link", { name: /Download PDF/ }),
  ).toHaveAttribute("download", "Dylan-Kwok-Resume.pdf");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("selects destinations, counts countries, shows state and national flags, and filters the travel globe", async ({
  page,
}) => {
  await go(page, "/atlas");
  const atlas = page.locator("#atlas");
  await expect(atlas.locator(".atlas-selected h3")).toHaveText("San Francisco");
  await expect(atlas.locator(".atlas-flag-caption")).toContainText(
    "CALIFORNIA STATE FLAG",
  );

  // Verify Country Counter metrics (12 countries, 06 US states, 32 destinations)
  const deck = atlas.locator(".atlas-passport-deck");
  await expect(deck.locator(".primary-metric .atlas-metric-value")).toHaveText(
    "12",
  );
  await expect(deck).toContainText("COUNTRIES LOGGED");
  await expect(deck).toContainText("06");
  await expect(deck).toContainText("32");

  // Filter by Switzerland chip -> Geneva & Lausanne
  await atlas
    .getByRole("toolbar", { name: "Filter destinations by country" })
    .getByRole("button", { name: /Switzerland/ })
    .click();
  await expect(atlas.locator(".atlas-place")).toHaveCount(2);
  await expect(atlas.locator(".atlas-selected h3")).toHaveText("Geneva");
  await atlas
    .locator(".atlas-list")
    .getByRole("button", { name: /Lausanne/ })
    .click();
  await expect(atlas.locator(".atlas-selected h3")).toHaveText("Lausanne");
  await expect(atlas.locator(".atlas-flag-caption")).toContainText(
    "FLAG OF SWITZERLAND",
  );

  // Filter by Japan chip -> Tokyo & Taiki Spaceport
  await atlas
    .getByRole("toolbar", { name: "Filter destinations by country" })
    .getByRole("button", { name: /Japan/ })
    .click();
  await expect(atlas.locator(".atlas-place")).toHaveCount(2);
  await atlas
    .locator(".atlas-list")
    .getByRole("button", { name: /Taiki Spaceport/ })
    .click();
  await expect(atlas.locator(".atlas-selected h3")).toHaveText(
    "Taiki Spaceport",
  );
  await expect(atlas.getByText("42.50° N / 143.44° E")).toBeVisible();
  await expect(atlas.locator(".atlas-flag-caption")).toContainText(
    "FLAG OF JAPAN",
  );

  // Clear country filter via Europe sector and search
  await atlas
    .getByRole("toolbar", { name: "Filter destinations by region" })
    .getByRole("button", { name: /Europe/ })
    .click();
  await atlas
    .getByRole("searchbox", { name: "Search destinations" })
    .fill("Rome");
  await expect(atlas.locator(".atlas-place")).toHaveCount(1);
  await atlas.getByRole("button", { name: "Clear search" }).click();

  // Rotate, zoom, auto-spin, and reset
  await atlas.getByRole("button", { name: "Rotate globe west" }).click();
  await atlas.getByRole("button", { name: "Zoom in globe" }).click();
  await atlas.getByRole("button", { name: "Auto-spin globe" }).click();
  await expect(
    atlas.getByRole("button", { name: "Pause globe rotation" }),
  ).toBeVisible();
  await page.waitForTimeout(220);
  await atlas.getByRole("button", { name: "Pause globe rotation" }).click();
  await atlas.getByRole("button", { name: "Reset globe" }).click();
  await expect(atlas.locator(".atlas-selected h3")).toHaveText("San Francisco");

  const pin = atlas.getByRole("button", {
    name: "Explore Yosemite, California, USA",
  });
  await pin.focus();
  await page.keyboard.press("Enter");
  await expect(atlas.locator(".atlas-selected h3")).toHaveText("Yosemite");
});

test("filters and navigates the photo archive with keyboard controls", async ({
  page,
}) => {
  await go(page, "/photos");
  const archive = page.locator("#photos");
  await expect(archive.locator(".photo-card")).toHaveCount(6);
  await archive.getByRole("button", { name: "Places", exact: true }).click();
  await expect(archive.locator(".photo-card")).toHaveCount(3);
  await archive.locator(".photo-card").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Road to nothing in particular",
  );
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText("Return leg");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Road to nothing in particular",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("opens dossiers for all teams, organizations, and personal projects", async ({ page }) => {
  await go(page, "/projects");
  await page
    .getByRole("button", {
      name: "Explore Untitled Rocketry",
    })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Untitled Rocketry." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "American Rocketry Challenge",
  );
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", {
      name: "Explore Irvington Driving Force H2GP team",
    })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Irvington Driving Force." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("Lead Engineer");
  await expect(page.getByRole("dialog")).toContainText("H2GP");
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore MakerCubed CubeSat structures work" })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "MakerCubed CubeSat Project." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "I work on structures",
  );
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore Fremont Student Makers nonprofit" })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Fremont Student Makers." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("501(c)(3)");
  await page.keyboard.press("Escape");

  // Personal projects
  await page
    .getByRole("button", {
      name: "Explore the Modular Rocket System project",
    })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Modular Rocket System." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "adaptable flight testing",
  );
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore the Telemetry Lost branching text RPG" })
    .click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Telemetry Lost." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(
    "strategic choices shape the story",
  );
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore the AstroForge rocket construction game" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "AstroForge." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("AI-assisted");
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore the VENA health app concept" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "VENA." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("injury triage");
  await expect(page.getByRole("dialog")).toContainText(
    "not a medical device",
  );
  await page.keyboard.press("Escape");

  await page
    .getByRole("button", { name: "Explore the ProtoQueue makerspace print tool" })
    .click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "ProtoQueue." }),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("3D print jobs");
  await page.keyboard.press("Escape");
});

test("filters projects by category and shows featured and new badges", async ({
  page,
}) => {
  await go(page, "/projects");
  const projects = page.locator("#projects");
  await expect(projects.locator(".project-link")).toHaveCount(9);

  const toolbar = projects.getByRole("toolbar", {
    name: "Filter projects by category",
  });

  await toolbar.getByRole("button", { name: /^Games/ }).click();
  await expect(projects.locator(".project-link")).toHaveCount(2);
  await expect(projects).toContainText("Telemetry Lost");
  await expect(projects).toContainText("AstroForge");
  await expect(projects.locator(".project-badge")).toHaveCount(2);

  await toolbar.getByRole("button", { name: /Software/ }).click();
  await expect(projects.locator(".project-link")).toHaveCount(2);
  await expect(projects).toContainText("VENA");
  await expect(projects).toContainText("ProtoQueue");

  await toolbar.getByRole("button", { name: /Engineering/ }).click();
  await expect(projects.locator(".project-link")).toHaveCount(1);
  await expect(projects).toContainText("Modular Rocket System");

  await toolbar.getByRole("button", { name: /Teams & Orgs/ }).click();
  await expect(projects.locator(".project-link")).toHaveCount(4);
  await expect(projects).toContainText("Untitled Rocketry");

  await toolbar.getByRole("button", { name: /^All Work/ }).click();
  await expect(projects.locator(".project-link")).toHaveCount(9);
  await expect(projects.locator(".project-badge")).toHaveCount(5);
});

test("validates Spotify links, saves a playlist, and persists it across reloads", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Change Spotify track or playlist" })
    .click();
  const field = page.getByRole("textbox", { name: "SPOTIFY LINK" });
  await field.fill("https://example.com/not-a-playlist");
  await page.getByRole("button", { name: "Save my frequency" }).click();
  await expect(page.getByRole("alert")).toContainText("Use a full Spotify");
  await field.fill(
    "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=example",
  );
  await page.getByRole("button", { name: "Save my frequency" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /embed\/playlist\/37i9dQZF1DXcBWIGoYBM5M/,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /embed\/playlist\/37i9dQZF1DXcBWIGoYBM5M/,
  );
  await page
    .getByRole("button", { name: "Change Spotify track or playlist" })
    .click();
  await page.getByRole("button", { name: "Restore Space Song" }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /embed\/track\/7H0ya83CMmgFcOhw0UB6ow/,
  );
});

test("runs, pauses, changes, and resets the orbital simulation", async ({
  page,
}) => {
  await go(page, "/projects");
  await page
    .getByRole("button", {
      name: "Explore and interact with the orbital sandbox",
    })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "A little orbital thinking." }),
  ).toBeVisible();
  const slider = dialog.getByRole("slider", { name: /ECCENTRICITY/ });
  await slider.focus();
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "aria-label",
    /eccentricity 0.00/,
  );
  await dialog.getByRole("button", { name: "Play orbit" }).click();
  const satellite = dialog.locator(".orbit-diagram > g[transform]");
  const initialPosition = await satellite.getAttribute("transform");
  await page.waitForTimeout(200);
  expect(await satellite.getAttribute("transform")).not.toBe(initialPosition);
  await dialog.getByRole("button", { name: "Pause orbit" }).click();
  const pausedPosition = await satellite.getAttribute("transform");
  await page.waitForTimeout(200);
  expect(await satellite.getAttribute("transform")).toBe(pausedPosition);
  await dialog.getByRole("button", { name: "Reset simulation" }).click();
  await expect(slider).toHaveValue("0.42");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("filters field notes and opens the full articles with keyboard focus restored", async ({
  page,
}) => {
  await go(page, "/notes");
  await expect(page.locator(".note-row")).toHaveCount(3);
  await page.getByRole("button", { name: "Perspective", exact: true }).click();
  await expect(page.locator(".note-row")).toHaveCount(1);
  const note = page.locator(".note-row");
  await note.click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "A good reason to keep looking up.",
  );
  await expect(page.locator(".note-article > p")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(note).toBeFocused();
  await page.getByRole("button", { name: "Learning", exact: true }).click();
  await expect(page.locator(".note-row")).toHaveCount(2);
});

test("opens the contact form, validates fields, and prepares an email draft", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Let's talk", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText("Let's make contact.");
  await dialog.getByRole("button", { name: "Open in my email app" }).click();
  expect(
    await dialog
      .locator("form")
      .evaluate((form: HTMLFormElement) => form.checkValidity()),
  ).toBe(false);
  await dialog.getByRole("textbox", { name: "YOUR NAME" }).fill("Taylor");
  await dialog
    .getByRole("textbox", { name: "YOUR EMAIL" })
    .fill("taylor@example.com");
  await dialog
    .getByRole("textbox", { name: "YOUR TRANSMISSION" })
    .fill("I would love to talk about your orbital project.");
  await dialog.getByRole("button", { name: "Open in my email app" }).click();
  await expect(dialog.getByRole("status")).toContainText("Your draft is ready");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Let's talk", exact: true }),
  ).toBeFocused();
});

test("fits narrow screens and supports mobile navigation", async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page.locator("h1").evaluate((element) => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getBoundingClientRect().right;
        }),
      )
      .toBeLessThanOrEqual(width - 10);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: /Experience/ })).toBeVisible();
  await expect(nav.getByRole("link", { name: /Atlas/ })).toBeVisible();
  await expect(nav.getByRole("button", { name: /Résumé/ })).toBeVisible();
  await nav.getByRole("link", { name: /Projects/ }).click();
  await expect(nav).toHaveCount(0);
  await expect(page).toHaveURL(/#\/projects$/);
  await expect(
    page.getByRole("heading", { name: "From flight hardware to software." }),
  ).toBeVisible();
  // Mobile: all nine cards stack in a single column and nothing overflows
  await expect(page.locator("#projects .project-link")).toHaveCount(9);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);

  // Experience page on mobile: entries collapse, résumé card first
  await go(page, "/experience");
  const entries = page.locator("#experience .experience-entry");
  await expect(entries).toHaveCount(5);
  await expect(entries.nth(0)).toHaveAttribute("open", "");
  await expect(entries.nth(1)).not.toHaveAttribute("open", "");
  await entries.nth(1).locator("summary").click();
  await expect(entries.nth(1)).toHaveAttribute("open", "");
  await expect(entries.nth(1)).toContainText("H2GP");

  // Atlas page on mobile: directory collapsed behind a toggle
  await go(page, "/atlas");
  const toggle = page.getByRole("button", { name: /BROWSE ALL 32 DESTINATIONS/ });
  await expect(toggle).toBeVisible();
  await expect(page.locator("#atlas-directory-panel")).toBeHidden();
  await toggle.click();
  await expect(page.locator("#atlas-directory-panel")).toBeVisible();
  await expect(page.locator("#atlas .atlas-place").first()).toBeVisible();
});

test("meets automated WCAG A and AA checks on every page and in dialogs", async ({
  page,
}) => {
  for (const path of ["/", "/experience", "/projects", "/atlas", "/photos", "/notes"]) {
    await go(page, path);
    await page.waitForTimeout(200);
    const audit = await new AxeBuilder({ page })
      .exclude("iframe")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(audit.violations, `violations on ${path}`).toEqual([]);
  }

  await go(page, "/");
  for (const name of [
    "Let's talk",
    "Change Spotify track or playlist",
    "A bit more about me",
    "Open résumé",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    const dialogAudit = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(dialogAudit.violations, `dialog ${name}`).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  await go(page, "/projects");
  for (const name of [
    "Explore and interact with the orbital sandbox",
    "Explore Untitled Rocketry",
    "Explore Irvington Driving Force H2GP team",
    "Explore MakerCubed CubeSat structures work",
    "Explore Fremont Student Makers nonprofit",
    "Explore the Modular Rocket System project",
    "Explore the Telemetry Lost branching text RPG",
    "Explore the AstroForge rocket construction game",
    "Explore the VENA health app concept",
    "Explore the ProtoQueue makerspace print tool",
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    const dialogAudit = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(dialogAudit.violations, `dialog ${name}`).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  await go(page, "/photos");
  await page.locator(".photo-card").first().click();
  const photoAudit = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(photoAudit.violations).toEqual([]);
  await page.keyboard.press("Escape");

  await go(page, "/notes");
  await page.locator(".note-row").first().click();
  const articleAudit = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(articleAudit.violations).toEqual([]);
});
