function Header({ theme, toggleTheme, onBellClick, toggleCalender }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  return (
    <header>
      <h1>notes.exe</h1>
      <div>
        <span>{formattedDate}</span>

        <button onClick={onBellClick}>
          🔔 Notifications
        </button>

        <button onClick={toggleCalender}>
          Calender
        </button>

        <button onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>
    </header>
  );
}

export default Header;