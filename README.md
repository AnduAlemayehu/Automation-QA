
👇

---

## Automation QA

### 📌 Tech Stack

* Playwright
* TypeScript
* Page Object Model (POM)
* GitHub Actions (CI ready)
* docker also ready

---

### ✅ Implemented Test Scenarios (Desktop & Mobile)

The following scenarios are implemented for both **Desktop** and **Mobile**:

1. **Demo Account Login**
2. **Display of 6 Core Sports on Left Panel**
3. **Display of InPlay Events Page**
4. **Market Page Loading Speed Measurement**

---

### 🧠 Framework Design Decisions

* Used **Page Object Model (POM)** for better maintainability
* Implemented **dynamic waits** instead of static sleeps
* Structured tests by platform:

  * `tests/desktop`
  * `tests/mobile`
* Added performance measurement for market page loading
* CI configuration prevents accidental `test.only` usage

---

### 📂 Project Structure

```
tests/
  ├── desktop/
  └── mobile/

pages/
  ├── desktop/
  └── mobile/
```

---

### ▶️ Install Dependencies

```
npm install
npx playwright install
```

---

### ▶️ Run All Tests

```
npx playwright test
```

---

### ▶️ Run Specific Test File

Run a specific mobile test:

```
npx playwright test tests/mobile/mobile-inplay-events.spec.ts
```

Run a specific desktop test:

```
npx playwright test tests/desktop/demo-account-login.spec.ts
```

---

### ▶️ Run Tests by Folder

Run all mobile tests:

```
npx playwright test tests/mobile
```

Run all desktop tests:

```
npx playwright test tests/desktop
```

---

### 📊 View HTML Report

After test execution:

```
npx playwright show-report
```

---

