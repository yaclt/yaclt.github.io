import clsx from "clsx";
import React from "react";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Configurable",
    description: (
      <>
        Yaclt gives you a good set of sensible defaults, but you can configure
        just about every part of it to your liking.
      </>
    ),
  },
  {
    title: "Integrated with Git",
    description: (
      <>
        Automatically parse issue numbers from current branch names for use in
        entries, checkout new a new branch with the release number when
        preparing releases, and more.
      </>
    ),
  },
  {
    title: "Scriptable",
    description: (
      <>
        Integrate with any tool via command line output, or use the Neovim
        plugin.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md padding-vert--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
