export default function AuthShell({ children }) {
  return (
    <main className="auth">
      <section className="auth-hero">
        <div className="logo">huddle<span>.</span></div>
        <h2>
          Better team days,
          <br />
          <em>decided together.</em>
        </h2>
        <ul className="auth-points">
          <li><span>💡</span> Anyone can pitch an idea, from a park picnic to a booked escape room</li>
          <li><span>▲</span> Upvote your favourites, and the best rise to the top</li>
          <li><span>💸</span> Tag every idea with a budget so plans stay realistic</li>
        </ul>
      </section>
      <section className="auth-panel">{children}</section>
    </main>
  );
}
