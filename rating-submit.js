import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module";
//  import event

export class RatingModal extends LitElement {
  static get styles() {
    return css`
      :host {
        font-family: Arial, Helvetica, sans-serif;
      }
      
      #submit-button,
      #cancel-button {
        border: none;
        color: #ffffff;
        background-color: #288ec8;
        text-align: center;
        font-size: 1.05rem;
        border-radius: 1em;
        padding: 0.6em 1.2em;
        cursor: pointer;
      }
      #cancel-button {
        background-color: grey;
      }
      #cancel-button:hover {
        background-color: #888;
      }

      #rating-button:hover,
      #submit-button:hover {
        background-color: #a9a9a9;
      }

      #rating-button {
        margin-top: 1rem;
      }
      h1 {
        margin-bottom: 0rem;
        margin-top: 1rem;
      }
      .modal {
        display: none;
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
        justify-content: center;
        align-items: center;
      }
      .modal-content {
        position: relative;
        top: 1px;
        right: 1px;
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        align-items: center;
        border-radius: 14px;
      }
      .close {
        color: #aaaaaa;
        font-size: 28px;
        font-weight: bold;
      }
      .fa {
        color: orange;
      }
      .modal {
        display: none;
        height: 100vh;
      }
      .rating-div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
        margin: 20px;
      }
      .rating-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .rating-header > img {
        height: 48px;
      }
      .rating-button {
        position: inherit;
        border-radius: 1em;
        padding: 0.6em 1.2em;
        margin: 15px 0px;
        font-size: 1.05rem;
        border: none;
        color: #ffffff;
        background-color: #288ec8;
        text-align: center;
        font-size: 1.05rem;
        border-radius: 1em;
        padding: 0.76em 1.2em;
        cursor: pointer;
        
      }
      .rating-button:hover {
        background-color: #288ec8;
      }
      #submit-button {
        margin-right: 1rem;
      }

      .close:hover,
      .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
    `;
  }
  open() {
    this.shadowRoot.querySelector(".modal").style.display = "flex";
  }
  close() {
    this.shadowRoot.querySelector(".modal").style.display = "none";
  }
  handleSubmit(e) {
    e.preventDefault();

    const data = {
      rating: this.experiment_rating,
      lab_rating: this.lab_rating,
      data: "some data",
    };
    const myEvent = new CustomEvent("vl-rating-submit", {
      detail: data,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(myEvent);
  }
  static properties = {
    text: { type: String },
    experiment_rating: { type: Number },
    lab_rating: { type: Number },
  };
  constructor() {
    super();
    this.title = "Rating";
    this.experiment_rating = 4.5;
    this.lab_rating = 4.5;
  }
  render() {
    return html`
      <div class="rating-page">
    
          <div class="modal">
            <div class="modal-content">
              <div class="rating-header">
                <img src=" data:image/png;base64,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" />
                <span class="close" @click=${this.close}>&times;</span>
              </div>
               <h1 id="title">${this.title}</h1>
               <div class="rating-div">
                 <rating-element rating="6"></rating-element>
               </div>
              <div class="button-div">
                <button id="submit-button" @click=${this.handleSubmit}>
                  Submit
                </button>
                <button id="cancel-button" @click=${this.close}>Cancel</button>
              </div>
            </div>
          </div>
          <button class="v-button rating-button" id="rating-button" @click=${this.open}>
            Rate Experiment
          </button>
      </div>
    `;
  }
}

customElements.define("rating-submit", RatingModal);
