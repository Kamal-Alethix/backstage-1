/**
 * A Backstage plugin that helps you build a home page
 *
 * @packageDocumentation
 */
export { homePlugin, HomepageCompositionRoot, HomePageRandomJoke, HomePageToolkit, HomePageCompanyLogo, HomePageStarredEntities, ComponentAccordion, ComponentTabs, ComponentTab, WelcomeTitle, } from './plugin';
export { SettingsModal, HeaderWorldClock } from './components';
export * from './assets';
export type { ClockConfig } from './components';
export { createCardExtension } from './extensions';
export type { ComponentRenderer } from './extensions';
