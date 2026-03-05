function Header({
  theme,
  toggleTheme,
  onBellClick,
  toggleCalendar,
  toggleSidebar   // NEW
}) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  return (
    <header>
      {/* Left Side */}
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <b>notes.exe</b>
      </div>

      {/* Right Side */}
      <div className="header-right">
        <span>{formattedDate}</span>

        <button onClick={onBellClick}>
          <i className="fi fi-bs-bell-notification-social-media"></i>
        </button>

        <button onClick={toggleCalendar}>
          <i className="fi fi-br-calendar-day"></i>
        </button>

        <button onClick={toggleTheme}>
          {theme === "dark" ? (
            <i className="fi fi-rc-moon"></i>
          ) : (
            <i className="fi fi-sc-moon"></i>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;