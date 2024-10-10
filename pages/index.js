import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cool App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://nextjs.org">Next.js</a> deployed using Pulumi into AWS App Runner!
        </h1>

        <p className={styles.description}>
          Get started by reading the{" "}
          <code className={styles.code}>README.md</code>
        </p>

        <div className={styles.grid}>
          <a href="https://www.pulumi.com/docs/iac" className={styles.card}>
            <h3>Pulumi IaC &rarr;</h3>
            <p>Learn more about Pulumi Infrastructure as Code</p>
          </a>

          <a href="https://aws.amazon.com/apprunner" className={styles.card}>
            <h3>App Runner &rarr;</h3>
            <p>Learn about the AWS App Runner Service</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer} />
    </div>
  );
}
