/** Server-rendered scholion markup for two refs (`alpha` with line number, `beta` without code line). */
export const FIXTURE = `
<pre id="pre"><code>
  <span class="line" data-line="3"><span style="color: var(--color-syntax-keyword)">const</span> <a class="ref" data-ref="alpha" href="#explain-alpha"><span style="color: rgb(1, 2, 3)">foo</span></a> = <a class="ref" data-ref="beta" href="#explain-beta">bar</a></span>
</code></pre>
<section>
  <div data-explains="alpha" id="explain-alpha" tabindex="-1">
    <p id="desc-alpha">About <a class="ref-target" data-ref="alpha" href="#x">foo</a> here</p>
  </div>
  <div data-explains="beta" id="explain-beta" tabindex="-1">
    <p id="desc-beta">About beta</p>
  </div>
</section>
<a class="ref" data-ref="orphan" href="#nowhere">orphan</a>
`;

export function mount(html: string = FIXTURE): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);
    return root;
}
