const domainForm = document.querySelector('.domainForm');
const clientInputId = document.querySelector('.client-id');
const loadingText = document.querySelector('.loadingText');
const dataWrapper = document.querySelector('.dataWrapper');
const zonesTable = document.querySelector('.zonesTable');
const customersDomains = '/customersDomains';
const dnsRecordsId = '/dnsRecordsId';

async function fetchDomains(id = 100) {
  const url = `${customersDomains}?clientId=${id}`;
  try {
    loadingText.textContent = 'Loading domains....';
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    loadingText.textContent = 'Wrong client id, try another one!';
    console.error('Error fetching domains:', error);
  }
}

async function fetchDNSRecords(zone) {
  const url = `${dnsRecordsId}?zoneAndId=${zone}`;
  zonesTable.innerHTML = '<h1>Loading zones.....</h1>';

  try {
    const { data } = await axios.get(url);
    return displayZonesTable(data);
  } catch (error) {
    console.error(`Error fetching DNS records for zone ${zone}:`, error);
  }
}

async function displayDomains() {
  const receivedClientIt = clientInputId.value;
  loadingText.style.display = 'block';
  dataWrapper.innerHTML = '';
  dataWrapper.style.opacity = 0;
  const domainsData = await fetchDomains(receivedClientIt);
  if (!domainsData) return;

  loadingText.style.display = 'none';

  for (let index = 0; index <= domainsData.length; index++) {
    const data = domainsData[index];
    console.log(data);
    const select = document.createElement('select');
    select.onchange = (e) => displayRecords(e);
    const label = document.createElement('label');

    const optionsList = data.zones.map((zone) => {
      return ` <option value="${zone.uri}" >${zone.name}</option>`;
    });

    select.innerHTML = `
                  <option value="initialSelect" selected>Select</option>
                  ${optionsList} `;

    label.textContent = data.name;

    label.appendChild(select);
    dataWrapper.appendChild(label);
    dataWrapper.style.opacity = 1;
  }
}

function displayZonesTable({ name, records }) {
  let table = document.createElement('table');
  table.style.opacity = 0;
  table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Type</th><th>Content</th><th>TTL</th><th>Priority</th><th>Change Date</th></tr>`;

  records.forEach((record) => {
    const tr = document.createElement('tr');
    tr.innerHTML = ` <td>${record.id}</td>
          <td>${record.name}</td>
          <td>${record.type}</td>
          <td>${record.content}</td>
          <td>${record.ttl}</td>
          <td>${record.prio}</td>
          <td>${new Date(record.change_date * 1000).toLocaleDateString()}</td>`;

    table.appendChild(tr);
  });
  zonesTable.innerHTML = `<h1>${name}</h1>`;

  zonesTable.appendChild(table);
  table.style.opacity = 1;
}

domainForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await displayDomains();
});

async function displayRecords(select) {
  if (select) {
    await fetchDNSRecords(select.target.value);
  }
}
