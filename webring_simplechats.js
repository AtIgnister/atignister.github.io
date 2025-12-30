const DATA_FOR_WEBRING = [
  {
    "name": "Kami's Corner",
    "url": "https://kami.bearblog.dev",
    "owner": "Kami"
  },
  {
    "name": "monocyte’s blog ",
    "url": "https://monocyte.bearblog.dev",
    "owner": "Mono"
  },
  {
    "name": "Mooses's Blog",
    "url": "https://tanzi-media.com/",
    "owner": "Moose"
  },
  {
    "name": "Absurd Pirate's Internet Lounge",
    "url": "https://absurdpirate.com/",
    "owner": "Absurd Pirate"
  }
];

// I have shamelessly stolen this script from https://css-tricks.com/how-you-might-build-a-modern-day-webring/
// credit goes to them
const default_styles = document.createElement("template");
default_styles.innerHTML = `
<style>
.webring {
  border: 15px solid #222;
  border-top-color: #666;
  border-left-color: #666;
  padding: 1rem;

  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-gap: 1rem;

  text-align: center;

  font: 100% system-ui, sans-serif;
}

.webring a {
  color: lightblue;
}

.icon {
  font-size: 100px;
}
</style>

<div class="webring">
  <div class="icon"></div>
  <div id="copy">
    
  </div>
  <div class="icon"></div>
</div>`;

class WebRing extends HTMLElement {
  connectedCallback() {
    const sites = DATA_FOR_WEBRING;
    this.attachShadow({ mode: "open" });

    // Always append template first (so #copy exists)
    this.shadowRoot.appendChild(default_styles.content.cloneNode(true));

    // Apply custom styles from attribute if provided
    const customStyleAttr = this.getAttribute("custom-style");
    if (customStyleAttr) {
      const customStyle = document.createElement("style");
      customStyle.textContent = customStyleAttr;
      this.shadowRoot.appendChild(customStyle);
    } else {
      this.shadowRoot.appendChild(default_styles.content.cloneNode(true));
    }

    // e.g. https://css-tricks.com
    const thisSite = this.getAttribute("site");

    // Find the current site in the data
    const matchedSiteIndex = sites.findIndex(
      (site) => site.url === thisSite
    );

    if (matchedSiteIndex === -1) {
      this.shadowRoot.querySelector("#copy").innerHTML = `<p>Site not found in webring</p>`;
      return;
    }

    const matchedSite = sites[matchedSiteIndex];

    let prevSiteIndex = matchedSiteIndex - 1;
    if (prevSiteIndex === -1) prevSiteIndex = sites.length - 1;

    let nextSiteIndex = matchedSiteIndex + 1;
    if (nextSiteIndex >= sites.length) nextSiteIndex = 0;

    const randomSiteIndex = this.getRandomInt(0, sites.length - 1);

    const cp = `
      <h1>SimpleChats Webring</h1>
      <p>
        You are on ${matchedSite.url}, owned by ${matchedSite.owner}!<br>
        This site is part of the SimpleChats webring! Use the controls below to discover other sites!
      </p>
          
      <p>
        <a href="${sites[prevSiteIndex].url}">[Prev]</a>
        <a href="${sites[nextSiteIndex].url}">[Next]</a>
        <a href="${sites[randomSiteIndex].url}">[Random]</a>
      </p>
        `;

    this.shadowRoot
      .querySelector("#copy")
      .insertAdjacentHTML("afterbegin", cp);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
window.customElements.define("webring-css", WebRing);