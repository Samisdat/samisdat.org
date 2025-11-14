import { Twain } from "./Twain";

export const Quote = () => (
  <figure className="quote">
    <blockquote lang="en">
      <p>
          Who loves code
          <br /> may code something lovable
          <br /> or at least believe tryin’
      </p>
    </blockquote>
    <figcaption>
      <div>
        <div>Mark Twain</div>
        <cite lang="en">The Curious Tinkerer</cite>
        <div className="subtitle" lang="en">
          Being Notes on the Gentle Art of Making Things Work
        </div>
      </div>
      <Twain />
    </figcaption>
  </figure>
);
