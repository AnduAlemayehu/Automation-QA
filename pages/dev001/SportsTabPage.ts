import { Page, expect } from '@playwright/test';

export class SportsTabPage {

  private consoleErrors: string[] = [];

  constructor(private page: Page) {}

  captureConsoleErrors() {
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

async verifySportSwitch(sportName: string) {

  console.log(`\n🔹 Switching to ${sportName}`);

  const tab = this.page.getByRole('tab', { name: sportName });

  const isAlreadySelected =
    (await tab.getAttribute('aria-selected')) === 'true';

  // Capture first event before switching
  const firstEventLocator = this.page
    .getByRole('link')
    .filter({ hasText: ' v ' })
    .first();

  const previousFirstEvent =
    await firstEventLocator.textContent().catch(() => null);

  const start = performance.now();

  await tab.click();

  if (!isAlreadySelected && previousFirstEvent) {
    // Wait until first event changes
    await expect.poll(
      async () => {
        return await this.page
          .getByRole('link')
          .filter({ hasText: ' v ' })
          .first()
          .textContent();
      },
      { timeout: 10000 }
    ).not.toBe(previousFirstEvent);
  } else {
    // Just ensure first event is visible
    await expect(firstEventLocator).toBeVisible();
  }

  const end = performance.now();
  const loadTime = ((end - start) / 1000).toFixed(2);

  console.log(`⏱ ${sportName} first event loaded in ${loadTime}s`);

//   expect(Number(loadTime)).toBeLessThanOrEqual(2);

  console.log(`✅ ${sportName} first event validation completed`);
}

  private async getEventTexts(): Promise<string[]> {

    const eventLinks = this.page
      .getByRole('link')
      .filter({ hasText: ' v ' });

    const count = await eventLinks.count();

    const events: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await eventLinks.nth(i).innerText();
      events.push(text.trim());
    }

    return events;
  }

  async verifyNoConsoleErrors() {
    expect(
      this.consoleErrors,
      `Console errors detected:\n${this.consoleErrors.join('\n')}`
    ).toHaveLength(0);
  }
}