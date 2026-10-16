const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatMoney = (amount) => currency.format(Math.round(amount));

function setRangeProgress(input) {
  const range = Number(input.max) - Number(input.min);
  const progress = ((Number(input.value) - Number(input.min)) / range) * 100;
  input.style.setProperty("--range-progress", `${progress}%`);
}

function updateSipCalculator() {
  const amountInput = document.querySelector("#sip-amount");
  const yearsInput = document.querySelector("#sip-years");
  const returnInput = document.querySelector("#sip-return");
  const monthlyInvestment = Number(amountInput.value);
  const years = Number(yearsInput.value);
  const annualReturn = Number(returnInput.value);
  const monthlyRate = annualReturn / 100 / 12;
  const months = years * 12;
  const futureValue = monthlyRate === 0
    ? monthlyInvestment * months
    : monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  document.querySelector("#sip-amount-value").textContent = formatMoney(monthlyInvestment);
  document.querySelector("#sip-years-value").textContent = `${years} ${years === 1 ? "year" : "years"}`;
  document.querySelector("#sip-return-value").textContent = `${annualReturn}%`;
  document.querySelector("#sip-result").textContent = formatMoney(futureValue);
  document.querySelector("#sip-invested").textContent = formatMoney(monthlyInvestment * months);
  document.querySelector("#sip-chart-end").textContent = `Year ${years}`;

  const points = [];
  for (let index = 0; index <= 32; index += 1) {
    const elapsedMonths = months * index / 32;
    const value = monthlyRate === 0
      ? monthlyInvestment * elapsedMonths
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, elapsedMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    points.push({ x: index / 32 * 440, y: 120 - (value / futureValue) * 105 });
  }

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  document.querySelector("#sip-chart .chart-line").setAttribute("d", linePath);
  document.querySelector("#sip-chart .chart-area").setAttribute("d", `${linePath} L440 140 L0 140 Z`);
  [amountInput, yearsInput, returnInput].forEach(setRangeProgress);
}

function updateRetirementCalculator() {
  const expenseInput = document.querySelector("#retirement-expense");
  const yearsInput = document.querySelector("#retirement-years");
  const inflationInput = document.querySelector("#retirement-inflation");
  const expenses = Number(expenseInput.value);
  const years = Number(yearsInput.value);
  const inflation = Number(inflationInput.value);
  const inflationFactor = Math.pow(1 + inflation / 100, years);
  const futureExpenses = expenses * inflationFactor;

  document.querySelector("#retirement-expense-value").textContent = formatMoney(expenses);
  document.querySelector("#retirement-years-value").textContent = `${years} ${years === 1 ? "year" : "years"}`;
  document.querySelector("#retirement-inflation-value").textContent = `${inflation}%`;
  document.querySelector("#retirement-result").textContent = formatMoney(futureExpenses);
  document.querySelector("#retirement-current").textContent = formatMoney(expenses);
  document.querySelector("#retirement-inflation-factor").textContent = `${inflationFactor.toFixed(1)}×`;
  [expenseInput, yearsInput, inflationInput].forEach(setRangeProgress);
}

document.querySelectorAll(".range-control input").forEach((input) => {
  input.addEventListener("input", () => {
    if (input.id.startsWith("sip-")) updateSipCalculator();
    else updateRetirementCalculator();
  });
});

document.querySelectorAll(".calculator-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedCalculator = tab.dataset.calculator;
    document.querySelectorAll(".calculator-tab").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".calculator-content").forEach((panel) => {
      const selected = panel.dataset.panel === selectedCalculator;
      panel.hidden = !selected;
      panel.classList.toggle("active", selected);
    });
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  primaryNav.classList.toggle("open", !expanded);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("open");
  });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
document.querySelectorAll(".calculator-tab").forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
});
updateSipCalculator();
updateRetirementCalculator();
