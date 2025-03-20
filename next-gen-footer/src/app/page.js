import ExplosionContainer from "@/components/ExplosionContainer";

export default function Home() {
  return (
    <>
      <section className="hero"></section>
      <section className="about">
        <p>
          The word collapsed, but the game survived. In the neon-lit ruins of
          civilization, the last remnants of power aren't in governments or
          corporations-they're in the **Oblivion Decks**. Each card carries a
          fragment of lost history, a code of survival, a weapon of deception.
          The elite hoard them. The rebels steal them. The desperate gamble
          their lives for them. Do you have what it takes to **play the game
          that decides the future**?
        </p>
      </section>
      <section className="outro"></section>
      <footer className="">
        <h1>The future is in your hands.</h1>
        <div className="copyright-info">
          <p>&copy; 2025 Oblivion Decks</p>
          <p>All rights reserved.</p>
        </div>

        <ExplosionContainer />
      </footer>
    </>
  );
}
