import { LitElement, html } from 'lit-element';

class DemoView extends LitElement {
	
	render() {
	return html`
	  <p>Demo-View</p>
	  `;
	}
}

customElements.define('demo-view', DemoView);