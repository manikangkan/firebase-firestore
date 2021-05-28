const userList = document.getElementById("user-list");
const addUserForm = document.getElementById("add-user-form");
const submit = document.getElementById("submit");

const renderUser = (docs) => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  const city = document.createElement("figcaption");
  const badge = document.createElement("span");

  const listDiv = document.createElement("div");
  listDiv.setAttribute("class", "ms-2 me-auto");

  name.textContent = docs.data().name;
  city.textContent = docs.data().city;
  badge.textContent = "Pop";

  li.setAttribute("data-id", docs.id);
  name.setAttribute("class", "fw-bold");
  city.setAttribute("class", "blockquote-footer");
  badge.setAttribute("class", "badge bg-primary rounded-pill px-3 py-2");
  badge.setAttribute("role", "button");
  li.setAttribute(
    "class",
    "list-group-item d-flex justify-content-between align-items-start"
  );

  listDiv.appendChild(name);
  listDiv.appendChild(city);

  li.appendChild(listDiv);
  li.appendChild(badge);
  userList.appendChild(li);

  // Popping Data
  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    console.log("Data Id ", id);
    db.collection("users").doc(id).delete();
  });
};

db.collection("users")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    console.log(changes);
    changes.forEach((change) => {
      if (change.type === "added") {
        renderUser(change.doc);
      } else if (change.type === "removed") {
        const li = userList.querySelector("[data-id=" + change.doc.id + "]");
        userList.removeChild(li);
      }
    });
  });

//   Pushing Data
addUserForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("clicked");
  db.collection("users").add({
    name: addUserForm.name.value,
    city: addUserForm.city.value,
  });
  addUserForm.name.value = "";
  addUserForm.city.value = "";
});
