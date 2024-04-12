const ironOptions = {
  cookieName: "orbit_skills",
  password: "orbitSkills-orbitSkills-orbitSkills",
  secure: process.env.NODE_ENV === "production",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export default ironOptions
