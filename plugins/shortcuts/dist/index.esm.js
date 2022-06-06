import { pageTheme } from '@backstage/theme';
import ObservableImpl from 'zen-observable';
import { v4 } from 'uuid';
import { createApiRef, createPlugin, createApiFactory, storageApiRef, createComponentExtension } from '@backstage/core-plugin-api';

class LocalStoredShortcuts {
  constructor(storageApi) {
    this.storageApi = storageApi;
    this.subscribers = /* @__PURE__ */ new Set();
    this.observable = new ObservableImpl((subscriber) => {
      subscriber.next(this.get());
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
    this.THEME_MAP = {
      catalog: "home",
      docs: "documentation"
    };
  }
  shortcut$() {
    return this.observable;
  }
  async add(shortcut) {
    const shortcuts = this.get();
    shortcuts.push({ ...shortcut, id: v4() });
    await this.storageApi.set("items", shortcuts);
    this.notify();
  }
  async remove(id) {
    const shortcuts = this.get().filter((s) => s.id !== id);
    await this.storageApi.set("items", shortcuts);
    this.notify();
  }
  async update(shortcut) {
    const shortcuts = this.get().filter((s) => s.id !== shortcut.id);
    shortcuts.push(shortcut);
    await this.storageApi.set("items", shortcuts);
    this.notify();
  }
  getColor(url) {
    var _a;
    const type = url.split("/")[1];
    const theme = (_a = this.THEME_MAP[type]) != null ? _a : Object.keys(pageTheme).includes(type) ? type : "tool";
    return pageTheme[theme].colors[0];
  }
  get() {
    var _a;
    return Array.from((_a = this.storageApi.snapshot("items").value) != null ? _a : []).sort((a, b) => a.title >= b.title ? 1 : -1);
  }
  notify() {
    for (const subscription of this.subscribers) {
      subscription.next(this.get());
    }
  }
}

const shortcutsApiRef = createApiRef({
  id: "plugin.shortcuts.api"
});

const shortcutsPlugin = createPlugin({
  id: "shortcuts",
  apis: [
    createApiFactory({
      api: shortcutsApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) => new LocalStoredShortcuts(storageApi.forBucket("shortcuts"))
    })
  ]
});
const Shortcuts = shortcutsPlugin.provide(createComponentExtension({
  name: "Shortcuts",
  component: { lazy: () => import('./esm/Shortcuts-17e4c625.esm.js').then((m) => m.Shortcuts) }
}));

export { LocalStoredShortcuts, Shortcuts, shortcutsApiRef, shortcutsPlugin };
//# sourceMappingURL=index.esm.js.map
