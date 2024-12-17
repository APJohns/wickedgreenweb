import styles from './page.module.css';

export default function Page() {
  return (
    <main className={styles.articleStyling}>
      <h1>How it works</h1>
      <p></p>
      <h2>Sustainability Web Model</h2>
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
      <h3>Rating scale</h3>
      <p>
        The <a href="https://sustainablewebdesign.org/digital-carbon-ratings/">rating scale</a> is also defined by SWD.
        It uses the global average of 2.4&thinsp;MB as the pass/fail threshold. Meaning anything higher than the average
        is am &quot;F&quot;, and anything smaller gets graded &quot;A&quot; through &quot;E&quot; depending on their
        score. The scale is rigorous and is meant to inspire organizations and developers to improve their
        sustainability.
      </p>
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
