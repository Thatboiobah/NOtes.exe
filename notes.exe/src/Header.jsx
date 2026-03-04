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
          🔔
        </button>

        <button onClick={toggleCalendar}>
          📅
        </button>

        <button onClick={toggleTheme}>
          🌗
        </button>
      </div>
    </header>
  );
}

export default Header;