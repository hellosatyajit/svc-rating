import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";
import { googleApiKey, timeLimit } from "./config";

/**
 * A custom web component for displaying star ratings fetched from Google Sheets.
 * Supports full stars, half stars, and empty stars with caching functionality.
 * @customElement rating-display
 * @extends LitElement
 */
export class DisplayRating extends LitElement {
  static get styles() {
    return [
      css`
        .star-images {
          width: 22px;
          margin: 0px 1px;
        }
        .fa::before {
          color: #ffb931;
        }
        .fa-star-o {
          color: #ffb931;
        }
      `,
    ];
  }

  /**
   * Component properties definition with their types
   */
  static get properties() {
    return {
      numberOfStars: { type: Number },
      rating: { type: Number },
      roundRating: { type: Number },
      title: { type: String },
      fullStars: { type: Number },
      halfStars: { type: Number },
      spreadsheetID: { type: String }, // Google Sheets ID for fetching rating data
      sheetName: { type: String }, // Sheet name within the spreadsheet
      columnName: { type: String }, // Column identifier for rating data
      columnValue: { type: String }, // Unique identifier (lab_name or exp_name)
      imagesDirectory: { type: String }, // Directory path for star images
    };
  }

  /**
   * Parses cached rating data from localStorage
   * @param {string} object - Stringified JSON from localStorage
   * @param {string} key - Identifier to look up rating
   * @returns {Object|null} Parsed rating data with timestamp or null if invalid
   */
  parse_local_storage_object(object, key) {
    if (object === null) return null;
    
    const parsedObject = JSON.parse(object);
    if (parsedObject === null) return null;

    return {
      timeFetched: parsedObject.timeFetched,
      rating: parsedObject["rating"][key],
    };
  }

  /**
   * Fetches rating data from cache or Google Sheets API
   * Implements caching strategy with timeLimit threshold
   */
  async get_rating() {
    const key = this.columnValue;
    const dataObject = await this.parse_local_storage_object(
      localStorage.getItem("vl_data"),
      key
    );
    
    const timeFetched = dataObject?.timeFetched ?? 0;
    const currentTime = new Date().getTime();

    if (
      dataObject?.rating &&
      timeFetched &&
      currentTime - timeFetched < timeLimit
    ) {
      this.rating = dataObject.rating;
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetID}/values/${this.sheetName}!A:O?key=${googleApiKey}`;
    const vl_data = { rating: {} };

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      const values = data.values;
      const colIndex = values[0].indexOf(this.columnName);
      const ratingIndex = values[0].indexOf("Rating");

      for (let i = 1; i < values.length; i++) {
        vl_data["rating"][values[i][colIndex]] = values[i][ratingIndex];
        if (values[i][colIndex] === this.columnValue) {
          this.rating = values[i][ratingIndex];
        }
      }

      vl_data["timeFetched"] = new Date().getTime();
      localStorage.setItem("vl_data", JSON.stringify(vl_data));
    } catch (error) {
      console.error("Failed to fetch rating data:", error);
      this.rating = 0;
    }

    if (Object.keys(vl_data["rating"]).length === 0) {
      console.warn("No rating data found");
      this.rating = 0;
    }
  }

  /**
   * Initializes component and fetches initial rating
   */
  connectedCallback() {
    super.connectedCallback();
    this.rating = 0;
    this.get_rating();
  }

  // Property getters and setters
  get sheetName() { return this._sheetName; }
  set sheetName(name) {
    this._sheetName = name;
    this.requestUpdate();
  }

  get spreadsheetID() { return this._spreadsheetID; }
  set spreadsheetID(id) {
    this._spreadsheetID = id;
    this.requestUpdate();
  }

  get columnName() { return this._columnName; }
  set columnName(name) {
    this._columnName = name;
    this.requestUpdate();
  }

  get imagesDirectory() { return this._imagesDirectory; }
  set imagesDirectory(directory) {
    this._imagesDirectory = directory;
    this.requestUpdate();
  }

  get columnValue() { return this._columnValue; }
  set columnValue(value) {
    this._columnValue = value;
    this.requestUpdate();
  }

  get fullStars() { return this._fullStars; }
  set fullStars(newVal) {
    this._fullStars = newVal;
    this.requestUpdate();
  }

  get halfStars() { return this._halfStars; }
  set halfStars(newVal) {
    this._halfStars = newVal;
    this.requestUpdate();
  }

  /**
   * Updates rating and calculates full/half stars
   */
  set rating(newRating) {
    this._rating = newRating;
    this._roundRating = Math.round(2 * newRating) / 2;
    
    if (this._roundRating % 1 === 0) {
      this._fullStars = this._roundRating;
      this._halfStars = 0;
    } else {
      this._fullStars = Math.floor(this._roundRating);
      this._halfStars = 1;
    }
    this.requestUpdate();
  }
  get rating() { return this._rating; }

  get title() { return this._title; }
  set title(newTitle) { this._title = newTitle; }

  get numberOfStars() { return this._numberOfStars; }
  set numberOfStars(newVal) {
    this._numberOfStars = newVal;
    this.requestUpdate();
  }

  /**
   * Initializes component with default values
   */
  constructor() {
    super();
    this._numberOfStars = 5;
    if (this._roundRating % 1 === 0) {
      this._fullStars = this._roundRating;
      this._halfStars = 0;
    } else {
      this._fullStars = Math.floor(this._roundRating);
      this._halfStars = 1;
    }
    
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.type = "text/javascript";
    fa.href = "https://unpkg.com/fontawesome@5.6.3/index.js";
    document.head.appendChild(fa);
  }

  /**
   * Renders the star rating display
   */
  render() {
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < this._fullStars; i++) {
      stars.push(html`<img src=${this.imagesDirectory}star.svg class="star-images"></img>`);
    }
    
    // Add half stars
    for (let i = 0; i < this._halfStars; i++) {
      stars.push(html`<img src=${this.imagesDirectory}half-star.svg class="star-images"></img>`);
    }
    
    // Add empty stars
    for (let i = 0; i < this._numberOfStars - this._fullStars - this._halfStars; i++) {
      stars.push(html`<img src=${this.imagesDirectory}empty-star.svg class="star-images empty-star"></img>`);
    }

    return html`<div>
      <h3>${this.title}</h3>
      <div class="star-div">${stars}</div>
    </div>`;
  }
}

customElements.define("rating-display", DisplayRating);
