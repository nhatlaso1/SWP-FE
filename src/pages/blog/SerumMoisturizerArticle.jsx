import React from "react";
import { useNavigate } from "react-router-dom";
import "./SerumMoisturizerArticle.css";

export default function SerumMoisturizerArticle() {
  const navigate = useNavigate();

  const handleQuizClick = () => {
    navigate("/take-quiz");
  };

  return (
    <div className="article-container">
      {/* Article Header */}
      <header className="article-header">
        <h1 className="article-title">Do I Need a Serum and a Moisturizer?</h1>
        
      </header>

      {/* Article Introduction */}
      <section className="article-intro">
        <p>
          Many of my patients and Reddit followers alike often ask me this
          question: “Do I need to use a serum and a moisturizer, or can I pick
          one?”{" "}
          <strong>
            The answer for most people is yes, you do need both a serum and
            moisturizer.
          </strong>{" "}
          However, there are a few skin types that can get away with just using
          a serum alone. In this guide, I will walk you through the differences
          between serums and moisturizers, as well as how best to incorporate
          both into your skin care regimen based on your skin type.
        </p>
        <p>
          First, if you don’t already know your skin type, take the quiz to find
          out so you will know which advice to follow.
        </p>
        <button className="quiz-button" onClick={handleQuizClick}>
          Take the Quiz
        </button>
        <ul className="intro-list">
          <li>Most skin types need both a serum and a moisturizer.</li>
          <li>Very oily types can get away with only using serums.</li>
          <li>
            Combining serums under moisturizers to increase absorption and
            efficacy.
          </li>
        </ul>
        <div className="table-of-contents">
          <button className="toc-button">Table of content</button>
        </div>
      </section>

      {/* Article Body */}
      <section className="article-body">
        <img
          src="https://cdn.shopify.com/s/files/1/0740/5984/1838/files/serums-vs-moisturizers_800x.png?v=1738957205"
          alt="Serum vs Moisturizer Banner"
          className="article-banner"
        />
        <h2>Serum vs. Moisturizer: What’s the Difference?</h2>
        <p>
          Serums and moisturizers are often confused because they sometimes have
          a similar consistency. However, they are two different products with
          different goals.{" "}
          <strong>Serums are lightweight skin care products</strong> that
          contain concentrated active ingredients to treat a specific skin
          concern. Skin-brightening serums, for example, might contain vitamin
          C, kojic acid, or other lightening ingredients, while an anti-aging
          serum may contain ingredients like retinoids, extra vitamins, and
          peptides. The best serum for you will depend on both your skin type
          and the skin concerns you need to target.
        </p>
        <p>
          <strong>Moisturizers, on the other hand,</strong> tend to be thicker
          than serums and contain ingredients that hydrate and seal moisture
          into the skin.{" "}
          <a
            href="http://localhost:3000/product/1"
            className="inline-link"
            rel="noreferrer"
          >
            Barrier repair moisturizers
          </a>{" "}
          go a step further and mimic the skin’s natural lipid structure to
          strengthen its natural barrier, which not only keeps moisture in but
          also keeps irritants out. In other words, while some serums may
          contain hydrating ingredients, they don’t quite fill the special 1:1
          ratio of directly targeting specific skin concerns plus sealing in
          moisture.
        </p>

        <h3>
          Thus, you use serums to deliver active ingredients that target a
          specific skin concern, and moisturizers to hydrate and protect the
          skin.
        </h3>

        <div className="benefits-container">
          <div className="benefits-section">
            <h4>Benefits of Serums</h4>
            <ul>
              <li>
                Deliver concentrated active ingredients directly to the skin
              </li>
              <li>
                Target specific concerns like acne, dark spots, and fine lines
              </li>
              <li>Lightweight texture, making them suitable for layering</li>
              <li>Available for all skin types and concerns</li>
            </ul>
          </div>
          <div className="benefits-section">
            <h4>Benefits of Moisturizers</h4>
            <ul>
              <li>Hydrate the skin and prevent dryness</li>
              <li>Reinforce the skin’s protective barrier</li>
              <li>Provide occlusion</li>
              <li>
                Increase the absorption of serums and other skin care products
              </li>
              <li>
                Some include additional ingredients to reduce redness and
                inflammation
              </li>
            </ul>
          </div>
        </div>

        <img
          src="https://cdn.shopify.com/s/files/1/0740/5984/1838/files/when-to-combine-serums-and-moisturizers_800x.png?v=1738957339"
          alt="Combine Serums and Moisturizers"
          className="article-banner"
        />
        <h2>When to Combine Serums &amp; Moisturizers</h2>
        <p>
          If you have a specific skin concern like hyperpigmentation, fine
          lines, or rosacea, it’s typically best to use a serum targeted for
          that issue first, then follow with a moisturizer suitable for your
          skin type. If you’re extremely oily and not prone to dryness, you may
          find that a serum alone is sufficient, especially if that serum
          contains hydrating ingredients like hyaluronic acid.
        </p>
      </section>
    </div>
  );
}
