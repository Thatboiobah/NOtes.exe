function Header({
  theme,
  toggleTheme,
  onBellClick,
  toggleCalendar
}) {
  const today = new Date();
  const formattedDate =
    today.toLocaleDateString("en-GB");

  return (
    <header>
      <h1>notes.exe</h1>

      <div>
        <span>{formattedDate}</span>

        <button onClick={onBellClick}>
          🔔 Notifications
        </button>

        <button onClick={toggleCalendar}>
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