(() => {
  const STORAGE_KEY = "vinylbox_cart_v1";

  const readCart = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getCartCount = () =>
    readCart().reduce((sum, item) => sum + Math.max(0, Number(item?.qty) || 0), 0);

  const updateCartBadge = () => {
    const count = getCartCount();
    const on = count > 0;

    document
      .querySelectorAll('a.nav-link[href="cart.html"], a.nav-link[href="./cart.html"]')
      .forEach((a) => {
        if (on) {
          a.setAttribute("data-cart-badge", "1");
          a.setAttribute("data-cart-count", String(count));
        } else {
          a.removeAttribute("data-cart-badge");
          a.removeAttribute("data-cart-count");
        }
      });
  };

  window.VINYLBOX = window.VINYLBOX || {};
  window.VINYLBOX.updateCartBadge = updateCartBadge;

  document.addEventListener("DOMContentLoaded", updateCartBadge);
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) updateCartBadge();
  });
  window.addEventListener("vinylbox:cart-updated", updateCartBadge);
})();

(() => {
  const MODAL_ID = "vinylbox-login-modal";

  const isLoginPage = () => document.body.classList.contains("auth-page");

  const buildModal = () => {
    if (document.getElementById(MODAL_ID)) return;

    const root = document.createElement("div");
    root.className = "login-modal";
    root.id = MODAL_ID;
    root.setAttribute("aria-hidden", "true");

    root.innerHTML = `
      <div class="login-modal__overlay" data-login-close></div>
      <aside class="login-drawer" role="dialog" aria-modal="true" aria-label="Вход">
        <button class="login-drawer__back" type="button" aria-label="Скрыть" data-login-close>
          <span class="login-drawer__back-arrow" aria-hidden="true">➜</span>
        </button>

        <div class="login-drawer__head">
          <h2 class="login-drawer__title">ВХОД</h2>
          <img class="login-drawer__logo" src="/images/sign_up/logo6.webp" alt="">
        </div>

        <form class="login-drawer__form" action="#" method="post">
          <label class="login-drawer__label" for="modal-login-email">Логин</label>
          <input class="login-drawer__input" id="modal-login-email" type="text" autocomplete="username" placeholder="">

          <label class="login-drawer__label" for="modal-login-pass">Пароль</label>
          <input class="login-drawer__input" id="modal-login-pass" type="password" autocomplete="current-password" placeholder="">
          <a class="login-drawer__forgot" href="#">Забыли пароль?</a>

          <label class="login-drawer__remember">
            <input class="login-drawer__check" type="checkbox">
            <span>запомнить меня</span>
          </label>

          <div class="login-drawer__actions">
            <button class="login-drawer__btn login-drawer__btn--primary" type="button">ВОЙТИ</button>
            <button class="login-drawer__btn login-drawer__btn--ghost" type="button">ЕЩЕ НЕТ АККАУНТА? СОЗДАДИМ НОВЫЙ</button>
          </div>

          <div class="login-drawer__legal">
            Нажимая кнопку «Войти», я даю согласие на обработку персональных данных и соглашаюсь на условия пользовательского соглашения
          </div>
        </form>
      </aside>
    `;

    document.body.appendChild(root);
  };

  const open = () => {
    buildModal();
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    modal._prev = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");

    const input = modal.querySelector("#modal-login-email");
    if (input) setTimeout(() => input.focus(), 0);
  };

  const close = () => {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");

    const prev = modal._prev;
    if (prev && typeof prev.focus === "function") setTimeout(() => prev.focus(), 0);
  };

  const bind = () => {
    if (isLoginPage()) return;

    buildModal();
    // Allow opening the login drawer via URL (e.g. index.html?login=1).
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "1") {
        params.delete("login");
        const qs = params.toString();
        const newUrl = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
        history.replaceState({}, "", newUrl);
        open();
      }
    } catch {
      // ignore
    }

    document
      .querySelectorAll('a.nav-link[href="login.html"], a.nav-link[href="./login.html"]')
      .forEach((a) => {
        a.addEventListener("click", (e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          open();
        });
      });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.matches("[data-login-close]")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const modal = document.getElementById(MODAL_ID);
      if (modal && modal.classList.contains("is-open")) close();
    });
  };

  document.addEventListener("DOMContentLoaded", bind);
})();

