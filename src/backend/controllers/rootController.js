export const home = (req, res) => {
  return res.render("home.pug", { pageTitle: "홈" });
};
