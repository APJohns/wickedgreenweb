import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'How it works | Wicked Green Web',
};

export default function Page() {
  return (
    <main className={`page-padding page-padding-v ${styles.articleStyling} ${styles.article}`}>
      <h1>FAQ</h1>

      <h2>How does it work?</h2>
      <h3>Sustainability Web Model</h3>
      <p>
        Wicked Green Web uses version 4 of the{' '}
        <a href="https://sustainablewebdesign.org/estimating-digital-emissions/">Sustainable Web Design Model (SWD)</a>.
      </p>
      <p>
        To summarize how it works, there are a few factors. The main factor being the file sizes that make up the page.
        The model accounts for that data across the follow segments.
      </p>
      <ul>
        <li>Data centers: hosting the page</li>
        <li>Networks: transmitting the page</li>
        <li>User&apos;s device: loading the page</li>
      </ul>
      <p>
        The remaining factors include how much of the above segments are powered by renewable energy sources, and site
        statistics. Those include new and returning visitor ratios, and how much of the site is cached for returning
        visitors.
      </p>
      <h4>Rating scale</h4>
      <p>
        The <a href="https://sustainablewebdesign.org/digital-carbon-ratings/">rating scale</a> is also defined by SWD.
        It uses the global average of 2.4&thinsp;MB as the pass/fail threshold. Meaning anything higher than the average
        is am &quot;F&quot;, and anything smaller gets graded &quot;A&quot; through &quot;E&quot; depending on their
        score. The scale is rigorous and is meant to inspire organizations and developers to improve their
        sustainability.
      </p>

      <h2>Why is my estimate different from other tools like websitecarbon or ecograder?</h2>
      <p>
        There are a few variables that can affect the estimated CO<sub>2</sub> between tools.
      </p>
      <ul>
        <li>
          <span className="u-bold">The model:</span> Wicked Green Web uses version 4 of the Sustainability Web Model,
          which is relatively new. Other tools might be using version 3 or a different model entirely.
        </li>
        <li>
          <span className="u-bold">Uncompressed vs transfer size:</span> Wicked Green Web uses the compressed size of
          the files. This represents the amount of data that is actually transmitted. Other tools might use the
          uncompressed file sizes. You can see these differing file sizes in your devtools.
        </li>
        <li>
          <span className="u-bold">Viewport dimensions:</span> Most of these tools, Wicked Green Web included, render
          the page in a headless browser to get the data needed. The viewport size chosen for that render can affect the
          file sizes loaded into the browser. The assets a page brings can vary depending on viewport size. Smaller
          viewports use smaller images, and some things might not even load in depending on size. Wicked Green Web
          renders the page at 1440px by 820px.
        </li>
      </ul>
      <h2>Resources</h2>
      <ul>
        <li>
          <a href="https://sustainablewebdesign.org">Sustainable Web Design</a>
        </li>
        <li>
          <a href="https://www.thegreenwebfoundation.org">The Green Web Foundation</a>
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/blog/introduction-to-web-sustainability/">
            Mozilla MDN Web Sustainability
          </a>
        </li>
        <li>
          <a href="https://www.w3.org/blog/2023/introducing-web-sustainability-guidelines/">W3 Web Sustainability</a>
        </li>
        <li>
          <a href="https://www.websitecarbon.com/">Website Carbon</a>
        </li>
        <li>
          <a href="https://ecograder.com">Ecograder</a>
        </li>
      </ul>
    </main>
  );
}
