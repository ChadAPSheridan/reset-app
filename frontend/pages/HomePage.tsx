import React from 'react';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to the <span className='app-name'><img src="Reset-Logo.svg" className='logo-in-text'/>eset</span> app</h1>
      <p>A minimalist, Kanban-style project management tool.</p>

      <section className="overview">
        <h2>Overview</h2>
        <p>
          Reset is a minimalist, Kanban-style project management tool designed for small programming teams. It emphasizes regular "reset moments" for sprint planning and retrospectives, enabling teams to stay focused and ship fast.
        </p>
      </section>

      <section className="features">
        <h2>Features</h2>
        <ul>
          <li><strong>Lightweight Kanban Board:</strong> Customizable lanes and dependencies visualization.</li>
          <li><strong>Minimal Overhead:</strong> Quick task creation and simple permissions.</li>
          <li><strong>Fresh Start Sprints:</strong> Clear the board at the start of each sprint and re-prioritize tasks.</li>
        </ul>
      </section>

      <section className="fresh-start-section">
        <h2>Fresh Start Button</h2>
        <p>
          This is a key feature of Reset, it clears away tasks marked as done and allows you to re-prioritize tasks that are still in progress.
        </p>
        <p>
          This helps in maintaining focus and ensuring that the most important tasks are always at the forefront.
        </p>
      </section>

      <section className="planned">
        <h2>Planned Features</h2>
        <ul>
          <li><strong>Integrated Developer Tools:</strong> Connect with code repositories and attach inline snippets.</li>
          <li><strong>Reflection and Iteration:</strong> Retro board for notes and progress snapshots.</li>
        </ul>
      </section>

      <Link href="/tasks">
        Go to Task Board
      </Link>
    </div>
  );
};

export default HomePage;