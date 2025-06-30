let heroesData = []
let currentPage = 1

async function fetchData() {
  const response = await fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  heroesData = await response.json()
  updateView()
  document.getElementById("pageSizeSelect").addEventListener("change", () => {
    currentPage = 1
    updateView()
  })
}

function loadData(heroes) {
  const start = (currentPage - 1) * getPageSize()
  const end = currentPage * getPageSize()
  const dataSlice = heroes.slice(start, end)
  renderTable(dataSlice)
  if (getPageSize() !== heroes.length) {
    renderPagination(Math.ceil(heroes.length / getPageSize()))
  } else {
    document.getElementById("paginationControls").innerHTML = ""
  }
}

function getPageSize() {
  const value = document.getElementById("pageSizeSelect").value
  if (value === "all") {
    return heroesData.length
  } else {
    return parseInt(value)
  }
}

function updateView() {
  loadData(heroesData)
}

function renderTable(data) {
  const tableContainer = document.getElementById("tableContainer")
  tableContainer.innerHTML = ""
  const table = document.createElement("table")
  const thead = document.createElement("thead")
  const tbody = document.createElement("tbody")

  // Create search input
  // const searchContainer = document.createElement("div")
  // searchContainer.innerHTML = `
  //   <label for="searchInput">Search:</label>
  //   <input type="text" id="searchInput" placeholder="Type a hero name" />
  // `
  // tableContainer.innerHTML = ""
  // tableContainer.appendChild(searchContainer)

  thead.innerHTML = `
    <tr>
      <th>Icon</th>
      <th>Name</th>
      <th>Full Name</th>
      <th>Intelligence</th>
      <th>Strength</th>
      <th>Speed</th>
      <th>Durability</th>
      <th>Power</th>
      <th>Combat</th>
      <th>Race</th>
      <th>Gender</th>
      <th>Height</th>
      <th>Weight</th>
      <th>Place of Birth</th>
      <th>Alignment</th>
    </tr>
  `

  data.forEach(hero => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td><img src="${hero.images.xs}" /></td>
      <td>${hero.name}</td>
      <td>${hero.biography.fullName}</td>
      <td>${hero.powerstats.intelligence}</td>
      <td>${hero.powerstats.strength}</td>
      <td>${hero.powerstats.speed}</td>
      <td>${hero.powerstats.durability}</td>
      <td>${hero.powerstats.power}</td>
      <td>${hero.powerstats.combat}</td>
      <td>${hero.appearance.race}</td>
      <td>${hero.appearance.gender}</td>
      <td>${hero.appearance.height.join(" / ")}</td>
      <td>${hero.appearance.weight.join(" / ")}</td>
      <td>${hero.biography.placeOfBirth}</td>
      <td>${hero.biography.alignment}</td>
    `
    tbody.appendChild(tr)
  })

  table.appendChild(thead)
  table.appendChild(tbody)
  tableContainer.appendChild(table)
}

function renderPagination(totalPages) {
  const pagination = document.getElementById("paginationControls")
  pagination.innerHTML = ""

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button")
    btn.textContent = i
    if (i === currentPage) btn.disabled = true
    btn.addEventListener("click", () => {
      currentPage = i
      updateView()
    })
    pagination.appendChild(btn)
  }
}
let search = document.getElementById('searchInput')
let timeout

search.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    const searchValue = search.value.trim().toLowerCase()
    const pageSizeSelect = document.getElementById("pageSizeSelect")
    if (pageSizeSelect.value !== "all") {
      pageSizeSelect.value = "all"
      currentPage = 1
      updateView()

    }

    document.querySelectorAll("table tbody tr").forEach(row => {
      const nameCell = row.querySelector("td:nth-child(2)")
      const name = nameCell.textContent.toLowerCase()
      row.style.display = name.includes(searchValue) ? "" : "none"
    })
  }, 300)
})



window.onload = fetchData
