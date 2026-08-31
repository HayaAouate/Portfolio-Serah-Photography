/**
 * Contact Form Module
 * Ouvre la fenêtre « Me contacter », valide les champs et transmet la demande.
 *
 * Deux modes d'envoi :
 *   - VITE_FORM_ENDPOINT défini  → POST JSON vers le service (Formspree, Web3Forms…)
 *   - sinon                      → repli sur le logiciel de messagerie du visiteur
 */

import { $, $$ } from '../utils/dom.js';
import { lockScroll, unlockScroll, trapFocus } from '../utils/a11y.js';

const ENDPOINT = import.meta.env?.VITE_FORM_ENDPOINT ?? '';
const MAILTO = 'bonjour@serah-photos.fr';

const RULES = [
  { id: 'cfNom', err: 'cfNomErr', empty: 'Merci d’indiquer votre nom.' },
  {
    id: 'cfMail',
    err: 'cfMailErr',
    empty: 'Merci d’indiquer votre e-mail.',
    invalid: 'Cet e-mail semble incomplet — vérifiez le format.',
  },
  { id: 'cfType', err: 'cfTypeErr', empty: 'Choisissez un type de shooting.' },
  { id: 'cfMsg', err: 'cfMsgErr', empty: 'Dites-moi en quelques mots ce que vous avez en tête.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class ContactForm {
  constructor() {
    this.modal = $('#contactModal');
    this.form = $('#contactForm');
    this.closeBtn = $('#cmClose');
    this.status = $('#cfStatus');
    this.submit = $('#cfSend');
    this.opener = null;

    if (this.modal && this.form) this.bindEvents();
  }

  bindEvents() {
    $$('[data-contact-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.opener = btn;
        this.toggle(true);
      });
    });

    this.closeBtn.addEventListener('click', () => this.toggle(false));

    // clic sur le voile, pas sur le panneau
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.toggle(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-on')) this.toggle(false);
    });

    this.modal.addEventListener('keydown', (e) => trapFocus(this.modal, e));
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  toggle(on) {
    this.modal.classList.toggle('is-on', on);
    if (on) {
      lockScroll();
      this.closeBtn.focus();
    } else {
      unlockScroll();
      if (this.opener) this.opener.focus();
    }
  }

  setStatus(text, kind) {
    if (!this.status) return;
    this.status.textContent = text || '';
    this.status.className = 'form__status' + (kind ? ` is-${kind}` : '');
    this.status.hidden = !text;
  }

  static setFieldError(rule, message) {
    const el = $(`#${rule.id}`);
    const box = $(`#${rule.err}`);
    el.closest('.field').classList.toggle('has-err', Boolean(message));
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    box.textContent = message || '';
    box.hidden = !message;
  }

  validate() {
    let firstInvalid = null;

    RULES.forEach((rule) => {
      const el = $(`#${rule.id}`);
      const value = el.value.trim();
      let message = '';

      if (!value) message = rule.empty;
      else if (el.type === 'email' && !EMAIL_RE.test(value)) message = rule.invalid;

      ContactForm.setFieldError(rule, message);
      if (message && !firstInvalid) firstInvalid = el;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      this.setStatus('', null);
    }
    return !firstInvalid;
  }

  readValues() {
    return {
      nom: $('#cfNom').value.trim(),
      email: $('#cfMail').value.trim(),
      type: $('#cfType').value,
      quand: $('#cfQuand').value.trim(),
      message: $('#cfMsg').value.trim(),
    };
  }

  static openMailClient(d) {
    const body = [
      `Nom : ${d.nom}`,
      `E-mail : ${d.email}`,
      `Type de shooting : ${d.type}`,
      `Date ou période : ${d.quand || 'non précisée'}`,
      '',
      d.message,
    ].join('\n');

    window.location.href =
      `mailto:${MAILTO}` +
      `?subject=${encodeURIComponent(`Demande de shooting — ${d.nom}`)}` +
      `&body=${encodeURIComponent(body)}`;
  }

  async onSubmit(e) {
    e.preventDefault();
    if (!this.validate()) return;

    const data = this.readValues();

    if (!ENDPOINT) {
      ContactForm.openMailClient(data);
      this.setStatus(
        'Votre logiciel de messagerie s’ouvre avec le message prérempli. Il ne reste qu’à l’envoyer.',
        'ok',
      );
      return;
    }

    this.submit.disabled = true;
    this.setStatus('Envoi en cours…', null);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));

      this.form.reset();
      this.setStatus('Merci, votre demande est partie. Je vous réponds sous 48 heures.', 'ok');
    } catch {
      this.setStatus(`L’envoi a échoué. Réessayez, ou écrivez directement à ${MAILTO}.`, 'ko');
    } finally {
      this.submit.disabled = false;
    }
  }
}
