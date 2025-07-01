
let heroesData = []
let currentPage = 1
let sortColumn = "name"
let sortDirection = "asc"
let searchValue = ""

async function fetchData() {
  try {
    const response = await fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")

    heroesData = await response.json()
    // console.log(heroesData);
  } catch {
    document.body.innerHTML = "error ajmi "
  }
  
  updateView()
  document.getElementById("pageSizeSelect").addEventListener("change", () => {
    currentPage = 1
    updateView()
  })
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
  let filtered = heroesData
  if (searchValue) {
    filtered = heroesData.filter(hero =>
      hero.name && hero.name.toLowerCase().includes(searchValue)
    )
  }
  filtered = simpleSort(filtered, sortColumn, sortDirection)
  loadData(filtered)
}

function simpleSort(data, column, direction) {
  return [...data].sort((a, b) => {
    let va = getColValue(a, column)
    let vb = getColValue(b, column)
    if ( va === "" && vb === "") return 0
    if (va === "") return 1
    if (vb === "") return -1
    if (!isNaN(va) && !isNaN(vb)) {
      va = Number(va)
      vb = Number(vb)
      return direction === "asc" ? va - vb : vb - va
    }
    // String sort
    va = String(va).toLowerCase()
    vb = String(vb).toLowerCase()
    if (va < vb) return direction === "asc" ? -1 : 1
    if (va > vb) return direction === "asc" ?1  : -1
    return 0
  })
}

function getColValue(hero, column) {
  switch (column) {
    case "name": return hero.name
    case "fullName": return hero.biography.fullName
    case "intelligence": return hero.powerstats.intelligence
    case "strength": return hero.powerstats.strength
    case "speed": return hero.powerstats.speed
    case "durability": return hero.powerstats.durability
    case "power": return hero.powerstats.power
    case "combat": return hero.powerstats.combat
    case "race": return hero.appearance.race
    case "gender": return hero.appearance.gender
    case "height":
      return hero.appearance.height && hero.appearance.height[1] ? height(hero.appearance.height[1]) : ""
    case "weight":
      return hero.appearance.weight && hero.appearance.weight[1] ? parsweight(hero.appearance.weight[1])  : ""
      
    case "placeOfBirth": return hero.biography.placeOfBirth
    case "alignment": return hero.biography.alignment
    default: return ""
  }
}

function parsweight(params) {


   params =  params.replace(",", "")

  if (params.includes("tons")) {
    return  parseInt(params) * 1000
  }else{
    return  parseInt(params)
  }
  
}

function height(params) {
     params =  params.replace(",", "")

  if (params.includes("meters")) {
    return  parseInt(params) * 100
  }else{
    return  parseInt(params)
  }
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

function renderTable(data) {
  const tableContainer = document.getElementById("tableContainer")
  tableContainer.innerHTML = ""
  const table = document.createElement("table")
  const thead = document.createElement("thead")
  const tbody = document.createElement("tbody")

  thead.innerHTML = `
    <tr>
    <th rowspan="2">Icon</th>
    <th rowspan="2" data-col="name" class="sortable">Name${sortColumn === "name" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="fullName" class="sortable">Full Name${sortColumn === "fullName" ? sortArrow() : ""}</th>
    
    <th colspan="6">Power Stats</th>

    <th rowspan="2" data-col="race" class="sortable">Race${sortColumn === "race" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="gender" class="sortable">Gender${sortColumn === "gender" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="height" class="sortable">Height${sortColumn === "height" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="weight" class="sortable">Weight${sortColumn === "weight" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="placeOfBirth" class="sortable">Place of Birth${sortColumn === "placeOfBirth" ? sortArrow() : ""}</th>
    <th rowspan="2" data-col="alignment" class="sortable">Alignment${sortColumn === "alignment" ? sortArrow() : ""}</th>
  </tr>
  <tr>
    <th data-col="intelligence" class="sortable">Intelligence${sortColumn === "intelligence" ? sortArrow() : ""}</th>
    <th data-col="strength" class="sortable">Strength${sortColumn === "strength" ? sortArrow() : ""}</th>
    <th data-col="speed" class="sortable">Speed${sortColumn === "speed" ? sortArrow() : ""}</th>
    <th data-col="durability" class="sortable">Durability${sortColumn === "durability" ? sortArrow() : ""}</th>
    <th data-col="power" class="sortable">Power${sortColumn === "power" ? sortArrow() : ""}</th>
    <th data-col="combat" class="sortable">Combat${sortColumn === "combat" ? sortArrow() : ""}</th>
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
      <td>${hero.appearance.height[1]}</td>
      <td>${hero.appearance.weight[1]}</td>
      <td>${hero.biography.placeOfBirth}</td>
      <td>${hero.biography.alignment}</td>
    `
    tbody.appendChild(tr)
  })

  table.appendChild(thead)
  table.appendChild(tbody)
  tableContainer.appendChild(table)

  // Add sort event listeners
  thead.querySelectorAll(".sortable").forEach(th => {
    th.style.cursor = "pointer"
    th.addEventListener("click", () => {
      const col = th.getAttribute("data-col")
      if (sortColumn === col) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc"
      } else {
        sortColumn = col
        sortDirection = "asc"
      }
      updateView()
    })
  })
}

function sortArrow() {
  return sortDirection === "asc" ? " ▲" : " ▼"
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
    searchValue = search.value.trim().toLowerCase()
    currentPage = 1
    updateView()
  }, 300)
})

window.onload = fetchData()
  
 
