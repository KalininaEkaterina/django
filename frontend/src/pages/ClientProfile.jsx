import "./profile.css";

export default function ClientProfile({ data }) {
  const { user, profile, joke } = data;

  return (
    <div className="card">
      <div className="left-container">
        <img src="/log2.png" alt="" />
        <h2 className="gradienttext">
          {profile.firstName} {profile.lastName}
        </h2>
        <a href="/profile/edit" className="btn">Change</a>
        <a href="/appointments" className="btn">Appointment</a>
        <a href="/" className="btn">Home</a>
      </div>

      <div className="right-container">
        <h3 className="gradienttext">Profile Details</h3>
        <table>
          <tbody>
            <tr><td>Email:</td><td>{user.email}</td></tr>
            <tr><td>Birth:</td><td>{profile.dateOfBirth}</td></tr>
            <tr><td>Mobile:</td><td>{profile.mobile}</td></tr>
            <tr><td>Address:</td><td>{profile.address}</td></tr>
          </tbody>
        </table>

        <div className="joke-container">
          <h3>Медицинская шутка дня</h3>
          <p>{joke}</p>
        </div>
      </div>
    </div>
  );
}
