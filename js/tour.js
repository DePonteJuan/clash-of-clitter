import { t } from "./i18n.js";

/**
 * @param {{ setTab: (tab: "catalog" | "planned") => void }} opts
 */
export function startAppTour({ setTab }) {
  const createDriver = window.driver?.js?.driver;
  if (typeof createDriver !== "function") {
    console.warn("Driver.js no está cargado");
    return;
  }

  const cardEl =
    document.querySelector("#line-list .poke-card") ||
    document.getElementById("line-list");
  const planEl =
    document.querySelector("#plan-list .plan-card") ||
    document.querySelector(".planned-bar") ||
    document.getElementById("plan-list");

  /** @param {string} titleKey @param {string} bodyKey */
  const pop = (titleKey, bodyKey) => ({
    title: t(titleKey),
    description: t(bodyKey),
    side: "bottom",
    align: "start",
  });

  const driverObj = createDriver({
    showProgress: true,
    animate: true,
    overlayOpacity: 0.55,
    stagePadding: 8,
    stageRadius: 12,
    nextBtnText: t("tourNext"),
    prevBtnText: t("tourPrev"),
    doneBtnText: t("tourDone"),
    progressText: "{{current}} / {{total}}",
    steps: [
      {
        popover: pop("tourWelcomeTitle", "tourWelcomeBody"),
      },
      {
        element: "#lang-select",
        popover: pop("tourLangTitle", "tourLangBody"),
      },
      {
        element: ".tabs",
        popover: pop("tourTabsTitle", "tourTabsBody"),
        onHighlightStarted: () => setTab("catalog"),
      },
      {
        element: "#filter-search",
        popover: pop("tourSearchTitle", "tourSearchBody"),
        onHighlightStarted: () => setTab("catalog"),
      },
      {
        element: "#filter-type-picker",
        popover: pop("tourTypeTitle", "tourTypeBody"),
      },
      {
        element: "#filter-role-picker",
        popover: pop("tourRoleTitle", "tourRoleBody"),
      },
      {
        element: ".filter-secondary",
        popover: pop("tourFiltersTitle", "tourFiltersBody"),
      },
      {
        element: ".toolbar-foot .actions",
        popover: pop("tourActionsTitle", "tourActionsBody"),
      },
      {
        element: cardEl,
        popover: pop("tourCardTitle", "tourCardBody"),
      },
      {
        element: "#tab-planned",
        popover: pop("tourPlannedTabTitle", "tourPlannedTabBody"),
        onHighlightStarted: () => setTab("planned"),
      },
      {
        element: "#btn-stars-wizard",
        popover: pop("tourWizardTitle", "tourWizardBody"),
        onHighlightStarted: () => setTab("planned"),
      },
      {
        element: planEl,
        popover: pop("tourPlanListTitle", "tourPlanListBody"),
        onHighlightStarted: () => setTab("planned"),
      },
      {
        popover: pop("tourDoneTitle", "tourDoneBody"),
        onHighlightStarted: () => setTab("catalog"),
      },
    ],
    onDestroyed: () => {
      setTab("catalog");
    },
  });

  setTab("catalog");
  driverObj.drive();
}
