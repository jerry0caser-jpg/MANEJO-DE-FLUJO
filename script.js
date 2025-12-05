// ========================================
// APLICACIÓN DE REGISTRO DE INGRESOS Y EGRESOS
// DESARROLLADO POR: GERARDO CASTAÑEDA SERRANO
// ========================================

// ========================================
// ESTRUCTURA DE DATOS Y ALMACENAMIENTO
// ========================================

const AppData = {
    companyName: 'Mi Empresa',
    brands: [],
    areas: [],
    subaccounts: [],
    paymentMethods: [],
    customColors: [],
    savedPeriods: [] // Array de periodos guardados con nombre
};

let currentPeriodKey = null;
let editingMovementId = null;

// Inicializar datos
function initializeApp() {
    const savedData = localStorage.getItem('appData');
    if (!savedData) {
        localStorage.setItem('appData', JSON.stringify(AppData));
    } else {
        Object.assign(AppData, JSON.parse(savedData));
    }
    
    loadCompanyName();
    populateYearSelect();
    populateMonthSelect();
    renderBrandList();
    renderAreaSubaccountList();
    renderPaymentMethodList();
    renderCustomColorList();
    renderSavedPeriods();
    setupEventListeners();
}

function saveData() {
    localStorage.setItem('appData', JSON.stringify(AppData));
}

// ========================================
// GESTIÓN DE NOMBRE DE EMPRESA
// ========================================

function loadCompanyName() {
    document.getElementById('company-name-display').textContent = AppData.companyName;
}

document.getElementById('edit-company-name-btn').addEventListener('click', () => {
    document.getElementById('company-name-modal').style.display = 'block';
    document.getElementById('company-name-input').value = AppData.companyName;
});

document.getElementById('save-company-name-btn').addEventListener('click', () => {
    const newName = document.getElementById('company-name-input').value.trim();
    if (newName) {
        AppData.companyName = newName;
        saveData();
        loadCompanyName();
        document.getElementById('company-name-modal').style.display = 'none';
    }
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('company-name-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// ========================================
// GESTIÓN DE EMPRESAS/MARCAS
// ========================================

function renderBrandList() {
    const container = document.getElementById('brand-list');
    container.innerHTML = '';
    
    AppData.brands.forEach((brand, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${brand}</span>
            <button onclick="deleteBrand(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('add-brand-btn').addEventListener('click', () => {
    const input = document.getElementById('new-brand-input');
    const value = input.value.trim();
    if (value && !AppData.brands.includes(value)) {
        AppData.brands.push(value);
        saveData();
        input.value = '';
        renderBrandList();
        updateSelectOptions();
    }
});

function deleteBrand(index) {
    AppData.brands.splice(index, 1);
    saveData();
    renderBrandList();
    updateSelectOptions();
}

// ========================================
// GESTIÓN DE ÁREAS Y SUBCUENTAS
// ========================================

function renderAreaSubaccountList() {
    const container = document.getElementById('area-subaccount-list');
    container.innerHTML = '';
    
    AppData.areas.forEach((area, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span><strong>Área:</strong> ${area}</span>
            <button onclick="deleteArea(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
    
    AppData.subaccounts.forEach((subaccount, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span><strong>Subcuenta:</strong> ${subaccount}</span>
            <button onclick="deleteSubaccount(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('add-area-btn').addEventListener('click', () => {
    const input = document.getElementById('new-area-input');
    const value = input.value.trim();
    if (value && !AppData.areas.includes(value)) {
        AppData.areas.push(value);
        saveData();
        input.value = '';
        renderAreaSubaccountList();
        updateSelectOptions();
    }
});

document.getElementById('add-subaccount-btn').addEventListener('click', () => {
    const input = document.getElementById('new-subaccount-input');
    const value = input.value.trim();
    if (value && !AppData.subaccounts.includes(value)) {
        AppData.subaccounts.push(value);
        saveData();
        input.value = '';
        renderAreaSubaccountList();
        updateSelectOptions();
    }
});

function deleteArea(index) {
    AppData.areas.splice(index, 1);
    saveData();
    renderAreaSubaccountList();
    updateSelectOptions();
}

function deleteSubaccount(index) {
    AppData.subaccounts.splice(index, 1);
    saveData();
    renderAreaSubaccountList();
    updateSelectOptions();
}

// ========================================
// GESTIÓN DE FORMAS DE PAGO
// ========================================

function renderPaymentMethodList() {
    const container = document.getElementById('payment-method-list');
    container.innerHTML = '';
    
    AppData.paymentMethods.forEach((method, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${method}</span>
            <button onclick="deletePaymentMethod(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('add-payment-method-btn').addEventListener('click', () => {
    const input = document.getElementById('new-payment-method-input');
    const value = input.value.trim();
    if (value && !AppData.paymentMethods.includes(value)) {
        AppData.paymentMethods.push(value);
        saveData();
        input.value = '';
        renderPaymentMethodList();
        updateSelectOptions();
    }
});

function deletePaymentMethod(index) {
    AppData.paymentMethods.splice(index, 1);
    saveData();
    renderPaymentMethodList();
    updateSelectOptions();
}

// ========================================
// GESTIÓN DE COLORES PERSONALIZADOS
// ========================================

function renderCustomColorList() {
    const container = document.getElementById('custom-color-list');
    container.innerHTML = '';
    
    AppData.customColors.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${color.hex}; border: 1px solid #ccc; margin-right: 10px;"></span>
                ${color.name}
            </span>
            <button onclick="deleteCustomColor(${index})">Eliminar</button>
        `;
        container.appendChild(div);
    });
}

document.getElementById('add-custom-color-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('new-color-name-input');
    const colorInput = document.getElementById('new-color-picker');
    const name = nameInput.value.trim();
    const hex = colorInput.value;
    
    if (name && hex) {
        AppData.customColors.push({ name, hex });
        saveData();
        nameInput.value = '';
        colorInput.value = '#000000';
        renderCustomColorList();
        updateSelectOptions();
    }
});

function deleteCustomColor(index) {
    AppData.customColors.splice(index, 1);
    saveData();
    renderCustomColorList();
    updateSelectOptions();
}

// ========================================
// ACTUALIZAR OPCIONES DE SELECT
// ========================================

function updateSelectOptions() {
    // Actualizar select de Marca
    const brandSelect = document.getElementById('movement-brand');
    const editBrandSelect = document.getElementById('edit-movement-brand');
    const filterBrandSelect = document.getElementById('filter-brand');
    
    [brandSelect, editBrandSelect, filterBrandSelect].forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccionar Empresa/Marca</option>';
            AppData.brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                select.appendChild(option);
            });
            select.value = currentValue;
        }
    });
    
    // Actualizar select de Área
    [document.getElementById('movement-area'), document.getElementById('edit-movement-area'), document.getElementById('filter-area')].forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccionar Área</option>';
            AppData.areas.forEach(area => {
                const option = document.createElement('option');
                option.value = area;
                option.textContent = area;
                select.appendChild(option);
            });
            select.value = currentValue;
        }
    });
    
    // Actualizar select de Subcuenta
    [document.getElementById('movement-subaccount'), document.getElementById('edit-movement-subaccount'), document.getElementById('filter-subaccount')].forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccionar Subcuenta</option>';
            AppData.subaccounts.forEach(subaccount => {
                const option = document.createElement('option');
                option.value = subaccount;
                option.textContent = subaccount;
                select.appendChild(option);
            });
            select.value = currentValue;
        }
    });
    
    // Actualizar select de Forma de Pago
    [document.getElementById('movement-payment-method'), document.getElementById('edit-movement-payment-method'), document.getElementById('filter-payment-method')].forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Seleccionar Forma de Pago</option>';
            AppData.paymentMethods.forEach(method => {
                const option = document.createElement('option');
                option.value = method;
                option.textContent = method;
                select.appendChild(option);
            });
            select.value = currentValue;
        }
    });
    
    // Actualizar select de Color Personalizado
    [document.getElementById('movement-custom-color-select'), document.getElementById('edit-movement-custom-color-select')].forEach(select => {
        if (select) {
            select.innerHTML = '';
            AppData.customColors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.name;
                option.textContent = color.name;
                select.appendChild(option);
            });
        }
    });
}

// ========================================
// GESTIÓN DE PERIODOS GUARDADOS
// ========================================

function populateYearSelect() {
    const yearSelect = document.getElementById('year-select');
    const newPeriodYearSelect = document.getElementById('new-period-year');
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
        
        const option2 = document.createElement('option');
        option2.value = i;
        option2.textContent = i;
        newPeriodYearSelect.appendChild(option2);
    }
    yearSelect.value = currentYear;
    newPeriodYearSelect.value = currentYear;
}

function populateMonthSelect() {
    const monthSelect = document.getElementById('month-select');
    const newPeriodMonthSelect = document.getElementById('new-period-month');
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
        
        const option2 = document.createElement('option');
        option2.value = index + 1;
        option2.textContent = month;
        newPeriodMonthSelect.appendChild(option2);
    });
    monthSelect.value = new Date().getMonth() + 1;
    newPeriodMonthSelect.value = new Date().getMonth() + 1;
}

function getPeriodKey() {
    const month = String(document.getElementById('month-select').value).padStart(2, '0');
    const year = document.getElementById('year-select').value;
    return `${year}-${month}`;
}

function getMonthYearDisplay(periodKey) {
    const [year, month] = periodKey.split('-');
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${months[parseInt(month) - 1]} ${year}`;
}

function renderSavedPeriods() {
    const container = document.getElementById('saved-periods-container');
    container.innerHTML = '';
    
    if (AppData.savedPeriods.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay periodos guardados</p>';
        return;
    }
    
    AppData.savedPeriods.forEach((period, index) => {
        const card = document.createElement('div');
        card.className = 'period-card';
        if (currentPeriodKey === period.periodKey) {
            card.classList.add('active');
        }
        
        const totalIncome = period.movements.reduce((sum, m) => m.type === 'ingreso' ? sum + m.amount : sum, 0);
        const totalExpense = period.movements.reduce((sum, m) => m.type === 'egreso' ? sum + m.amount : sum, 0);
        const balance = period.initialBalance.bank + period.initialBalance.cash + totalIncome - totalExpense;
        
        card.innerHTML = `
            <h4>${period.name}</h4>
            <p><strong>Periodo:</strong> ${getMonthYearDisplay(period.periodKey)}</p>
            <p><strong>Movimientos:</strong> ${period.movements.length}</p>
            <p><strong>Saldo Inicial:</strong> $${(period.initialBalance.bank + period.initialBalance.cash).toFixed(2)}</p>
            <p><strong>Saldo Final:</strong> $${balance.toFixed(2)}</p>
            <div class="period-card-actions">
                <button class="edit-btn" onclick="loadSavedPeriod(${index})">Cargar</button>
                <button class="edit-balance-btn" onclick="editSavedPeriodName(${index})">Renombrar</button>
                <button class="delete-btn" onclick="deleteSavedPeriod(${index})">Eliminar</button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function loadSavedPeriod(index) {
    const period = AppData.savedPeriods[index];
    currentPeriodKey = period.periodKey;
    
    const [year, month] = period.periodKey.split('-');
    document.getElementById('month-select').value = parseInt(month);
    document.getElementById('year-select').value = year;
    
    displayInitialBalance(period);
    renderMovementTableFromPeriod(period);
    document.getElementById('movement-registration-section').style.display = 'block';
    document.getElementById('movement-table-section').style.display = 'block';
    document.getElementById('reports-section').style.display = 'block';
    updateSelectOptions();
    renderSavedPeriods();
}

function editSavedPeriodName(index) {
    const newName = prompt('Ingrese el nuevo nombre para este periodo:', AppData.savedPeriods[index].name);
    if (newName && newName.trim()) {
        AppData.savedPeriods[index].name = newName.trim();
        saveData();
        renderSavedPeriods();
    }
}

function deleteSavedPeriod(index) {
    if (confirm('¿Está seguro de que desea eliminar este periodo?')) {
        AppData.savedPeriods.splice(index, 1);
        saveData();
        renderSavedPeriods();
        if (currentPeriodKey === AppData.savedPeriods[index]?.periodKey) {
            currentPeriodKey = null;
            document.getElementById('movement-registration-section').style.display = 'none';
            document.getElementById('movement-table-section').style.display = 'none';
            document.getElementById('reports-section').style.display = 'none';
        }
    }
}

document.getElementById('new-month-btn').addEventListener('click', () => {
    const periodKey = getPeriodKey();
    const existingPeriod = AppData.savedPeriods.find(p => p.periodKey === periodKey);
    
    if (!existingPeriod) {
        document.getElementById('modal-month-year').textContent = getMonthYearDisplay(periodKey);
        document.getElementById('initial-balance-modal').style.display = 'block';
    } else {
        alert('Este periodo ya existe. Use "Cargar Periodo" para acceder a él.');
    }
});

document.getElementById('initial-bank-input').addEventListener('input', updateInitialBalanceTotal);
document.getElementById('initial-cash-input').addEventListener('input', updateInitialBalanceTotal);
document.getElementById('edit-initial-bank-input').addEventListener('input', updateEditInitialBalanceTotal);
document.getElementById('edit-initial-cash-input').addEventListener('input', updateEditInitialBalanceTotal);

function updateInitialBalanceTotal() {
    const bank = parseFloat(document.getElementById('initial-bank-input').value) || 0;
    const cash = parseFloat(document.getElementById('initial-cash-input').value) || 0;
    document.getElementById('initial-balance-total').textContent = (bank + cash).toFixed(2);
}

function updateEditInitialBalanceTotal() {
    const bank = parseFloat(document.getElementById('edit-initial-bank-input').value) || 0;
    const cash = parseFloat(document.getElementById('edit-initial-cash-input').value) || 0;
    document.getElementById('edit-initial-balance-total').textContent = (bank + cash).toFixed(2);
}

document.getElementById('save-initial-balance-btn').addEventListener('click', () => {
    const periodKey = getPeriodKey();
    const bank = parseFloat(document.getElementById('initial-bank-input').value) || 0;
    const cash = parseFloat(document.getElementById('initial-cash-input').value) || 0;
    
    const newPeriod = {
        name: getMonthYearDisplay(periodKey),
        periodKey: periodKey,
        initialBalance: { bank, cash },
        movements: []
    };
    
    AppData.savedPeriods.push(newPeriod);
    saveData();
    document.getElementById('initial-balance-modal').style.display = 'none';
    renderSavedPeriods();
    loadSavedPeriod(AppData.savedPeriods.length - 1);
});

function openEditInitialBalanceModal() {
    if (!currentPeriodKey) {
        alert('Por favor, seleccione un periodo primero');
        return;
    }
    
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) {
        alert('Periodo no encontrado');
        return;
    }
    
    document.getElementById('edit-modal-month-year').textContent = period.name;
    document.getElementById('edit-initial-bank-input').value = period.initialBalance.bank;
    document.getElementById('edit-initial-cash-input').value = period.initialBalance.cash;
    updateEditInitialBalanceTotal();
    document.getElementById('edit-initial-balance-modal').style.display = 'block';
}

document.getElementById('save-edit-initial-balance-btn').addEventListener('click', () => {
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) return;
    
    period.initialBalance.bank = parseFloat(document.getElementById('edit-initial-bank-input').value) || 0;
    period.initialBalance.cash = parseFloat(document.getElementById('edit-initial-cash-input').value) || 0;
    
    saveData();
    document.getElementById('edit-initial-balance-modal').style.display = 'none';
    displayInitialBalance(period);
    renderMovementTableFromPeriod(period);
});

document.getElementById('cancel-edit-initial-balance-btn').addEventListener('click', () => {
    document.getElementById('edit-initial-balance-modal').style.display = 'none';
});

document.getElementById('load-month-btn').addEventListener('click', () => {
    const periodKey = getPeriodKey();
    const period = AppData.savedPeriods.find(p => p.periodKey === periodKey);
    
    if (period) {
        loadSavedPeriod(AppData.savedPeriods.indexOf(period));
    } else {
        alert('Este periodo no existe. Cree uno nuevo primero.');
    }
});

function displayInitialBalance(period) {
    const bank = period.initialBalance.bank;
    const cash = period.initialBalance.cash;
    const total = bank + cash;
    
    const display = document.getElementById('initial-balance-display');
    display.innerHTML = `
        <div>
            <strong>${period.name}</strong><br>
            Banco: $${bank.toFixed(2)} | Efectivo: $${cash.toFixed(2)} | <strong>Total: $${total.toFixed(2)}</strong>
        </div>
        <button class="edit-balance-btn" onclick="openEditInitialBalanceModal()">Editar Saldo</button>
    `;
}

// ========================================
// CREAR NUEVO PERIODO CON PRECARGA
// ========================================

document.getElementById('create-new-period-btn').addEventListener('click', () => {
    const name = document.getElementById('new-period-name').value.trim();
    const month = String(document.getElementById('new-period-month').value).padStart(2, '0');
    const year = document.getElementById('new-period-year').value;
    const precarga = document.getElementById('precarga-checkbox').checked;
    
    if (!name) {
        alert('Por favor, ingrese un nombre para el periodo');
        return;
    }
    
    const periodKey = `${year}-${month}`;
    const existingPeriod = AppData.savedPeriods.find(p => p.periodKey === periodKey);
    
    if (existingPeriod) {
        alert('Este periodo ya existe');
        return;
    }
    
    let movements = [];
    
    if (precarga) {
        const previousMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
        const previousYear = parseInt(month) === 1 ? parseInt(year) - 1 : year;
        const previousPeriodKey = `${previousYear}-${String(previousMonth).padStart(2, '0')}`;
        
        const previousPeriod = AppData.savedPeriods.find(p => p.periodKey === previousPeriodKey);
        
        if (previousPeriod) {
            movements = JSON.parse(JSON.stringify(previousPeriod.movements));
        }
    }
    
    const newPeriod = {
        name: name,
        periodKey: periodKey,
        initialBalance: { bank: 0, cash: 0 },
        movements: movements
    };
    
    AppData.savedPeriods.push(newPeriod);
    saveData();
    
    document.getElementById('new-period-name').value = '';
    document.getElementById('precarga-checkbox').checked = false;
    
    renderSavedPeriods();
    loadSavedPeriod(AppData.savedPeriods.length - 1);
});

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ========================================
// REGISTRO DE MOVIMIENTOS
// ========================================

document.getElementById('movement-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentPeriodKey) {
        alert('Por favor, seleccione un periodo primero');
        return;
    }
    
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) {
        alert('Periodo no encontrado');
        return;
    }
    
    const movement = {
        id: Date.now(),
        date: document.getElementById('movement-date').value,
        concept: document.getElementById('movement-concept').value,
        brand: document.getElementById('movement-brand').value,
        area: document.getElementById('movement-area').value,
        subaccount: document.getElementById('movement-subaccount').value,
        paymentMethod: document.getElementById('movement-payment-method').value,
        type: document.getElementById('movement-type').value,
        amount: parseFloat(document.getElementById('movement-amount').value),
        invoicingStatus: document.getElementById('movement-invoicing-status').value,
        invoiceNumber: document.getElementById('movement-invoice-number').value,
        customColor: document.getElementById('movement-custom-color-select').value,
        notes: document.getElementById('movement-notes').value
    };
    
    period.movements.push(movement);
    saveData();
    
    document.getElementById('movement-form').reset();
    renderMovementTableFromPeriod(period);
    clearTableFilters();
    renderSavedPeriods();
});

document.getElementById('movement-invoicing-status').addEventListener('change', (e) => {
    const invoiceNumberInput = document.getElementById('movement-invoice-number');
    const customColorSelect = document.getElementById('movement-custom-color-select');
    
    if (e.target.value === 'facturado') {
        invoiceNumberInput.style.display = 'block';
        customColorSelect.style.display = 'none';
    } else if (e.target.value === 'custom-color') {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'block';
    } else {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'none';
    }
});

document.getElementById('edit-movement-invoicing-status').addEventListener('change', (e) => {
    const invoiceNumberInput = document.getElementById('edit-movement-invoice-number');
    const customColorSelect = document.getElementById('edit-movement-custom-color-select');
    
    if (e.target.value === 'facturado') {
        invoiceNumberInput.style.display = 'block';
        customColorSelect.style.display = 'none';
    } else if (e.target.value === 'custom-color') {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'block';
    } else {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'none';
    }
});

// ========================================
// EDICIÓN DE MOVIMIENTOS
// ========================================

function openEditModal(movementId) {
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) return;
    
    const movement = period.movements.find(m => m.id === movementId);
    
    if (!movement) return;
    
    editingMovementId = movementId;
    
    document.getElementById('edit-movement-date').value = movement.date;
    document.getElementById('edit-movement-concept').value = movement.concept;
    document.getElementById('edit-movement-brand').value = movement.brand;
    document.getElementById('edit-movement-area').value = movement.area;
    document.getElementById('edit-movement-subaccount').value = movement.subaccount;
    document.getElementById('edit-movement-payment-method').value = movement.paymentMethod;
    document.getElementById('edit-movement-type').value = movement.type;
    document.getElementById('edit-movement-amount').value = movement.amount;
    document.getElementById('edit-movement-invoicing-status').value = movement.invoicingStatus;
    document.getElementById('edit-movement-invoice-number').value = movement.invoiceNumber;
    document.getElementById('edit-movement-custom-color-select').value = movement.customColor;
    document.getElementById('edit-movement-notes').value = movement.notes;
    
    const invoiceNumberInput = document.getElementById('edit-movement-invoice-number');
    const customColorSelect = document.getElementById('edit-movement-custom-color-select');
    
    if (movement.invoicingStatus === 'facturado') {
        invoiceNumberInput.style.display = 'block';
        customColorSelect.style.display = 'none';
    } else if (movement.invoicingStatus === 'custom-color') {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'block';
    } else {
        invoiceNumberInput.style.display = 'none';
        customColorSelect.style.display = 'none';
    }
    
    document.getElementById('edit-movement-modal').style.display = 'block';
}

document.getElementById('edit-movement-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) return;
    
    const movementIndex = period.movements.findIndex(m => m.id === editingMovementId);
    
    if (movementIndex === -1) return;
    
    period.movements[movementIndex] = {
        id: editingMovementId,
        date: document.getElementById('edit-movement-date').value,
        concept: document.getElementById('edit-movement-concept').value,
        brand: document.getElementById('edit-movement-brand').value,
        area: document.getElementById('edit-movement-area').value,
        subaccount: document.getElementById('edit-movement-subaccount').value,
        paymentMethod: document.getElementById('edit-movement-payment-method').value,
        type: document.getElementById('edit-movement-type').value,
        amount: parseFloat(document.getElementById('edit-movement-amount').value),
        invoicingStatus: document.getElementById('edit-movement-invoicing-status').value,
        invoiceNumber: document.getElementById('edit-movement-invoice-number').value,
        customColor: document.getElementById('edit-movement-custom-color-select').value,
        notes: document.getElementById('edit-movement-notes').value
    };
    
    saveData();
    document.getElementById('edit-movement-modal').style.display = 'none';
    renderMovementTableFromPeriod(period);
    renderSavedPeriods();
});

document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    document.getElementById('edit-movement-modal').style.display = 'none';
});

// ========================================
// RENDERIZADO DE TABLA
// ========================================

function renderMovementTableFromPeriod(period) {
    const tbody = document.querySelector('#movement-table tbody');
    tbody.innerHTML = '';
    
    let runningBalance = period.initialBalance.bank + period.initialBalance.cash;
    
    let filteredMovements = period.movements.filter(movement => {
        const conceptFilter = document.getElementById('filter-concept').value.toLowerCase();
        const brandFilter = document.getElementById('filter-brand').value;
        const areaFilter = document.getElementById('filter-area').value;
        const subaccountFilter = document.getElementById('filter-subaccount').value;
        const paymentFilter = document.getElementById('filter-payment-method').value;
        const typeFilter = document.getElementById('filter-type').value;
        
        if (conceptFilter && !movement.concept.toLowerCase().includes(conceptFilter)) return false;
        if (brandFilter && movement.brand !== brandFilter) return false;
        if (areaFilter && movement.area !== areaFilter) return false;
        if (subaccountFilter && movement.subaccount !== subaccountFilter) return false;
        if (paymentFilter && movement.paymentMethod !== paymentFilter) return false;
        if (typeFilter && movement.type !== typeFilter) return false;
        
        return true;
    });
    
    // Ordenar movimientos por fecha
    filteredMovements.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    filteredMovements.forEach((movement) => {
        const balance = movement.type === 'ingreso' 
            ? runningBalance + movement.amount 
            : runningBalance - movement.amount;
        
        runningBalance = balance;
        
        const row = document.createElement('tr');
        const formattedDate = formatDate(movement.date);
        const day = formattedDate.split('/')[0];
        
        let invoicingDisplay = '';
        let rowClass = '';
        
        if (movement.invoicingStatus === 'facturado') {
            invoicingDisplay = `Facturado: ${movement.invoiceNumber}`;
            rowClass = 'facturado';
        } else if (movement.invoicingStatus === 'pendiente') {
            invoicingDisplay = 'Pendiente';
            rowClass = 'pendiente';
        } else if (movement.invoicingStatus === 'sin-factura') {
            invoicingDisplay = 'Sin Factura';
            rowClass = 'sin-factura';
        } else if (movement.invoicingStatus === 'custom-color') {
            invoicingDisplay = movement.customColor;
            const customColor = AppData.customColors.find(c => c.name === movement.customColor);
            if (customColor) {
                row.style.backgroundColor = customColor.hex;
            }
        }
        
        row.className = rowClass;
        row.innerHTML = `
            <td>${day}</td>
            <td>${movement.concept}</td>
            <td>${movement.brand}</td>
            <td>${movement.area}</td>
            <td>${movement.subaccount}</td>
            <td>${movement.paymentMethod}</td>
            <td>${movement.type === 'ingreso' ? 'Ingreso' : 'Egreso'}</td>
            <td>$${movement.amount.toFixed(2)}</td>
            <td>$${balance.toFixed(2)}</td>
            <td>${invoicingDisplay}</td>
            <td style="max-width: 150px; word-wrap: break-word;">${movement.notes}</td>
            <td>
                <button class="edit-btn" onclick="openEditModal(${movement.id})">Editar</button>
                <button class="delete-btn" onclick="deleteMovement(${movement.id})">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function deleteMovement(movementId) {
    if (confirm('¿Está seguro de que desea eliminar este movimiento?')) {
        const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
        if (!period) return;
        
        period.movements = period.movements.filter(m => m.id !== movementId);
        saveData();
        renderMovementTableFromPeriod(period);
        renderSavedPeriods();
    }
}

function clearTableFilters() {
    document.getElementById('filter-concept').value = '';
    document.getElementById('filter-brand').value = '';
    document.getElementById('filter-area').value = '';
    document.getElementById('filter-subaccount').value = '';
    document.getElementById('filter-payment-method').value = '';
    document.getElementById('filter-type').value = '';
    if (currentPeriodKey) {
        const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
        if (period) {
            renderMovementTableFromPeriod(period);
        }
    }
}

document.getElementById('clear-filters-btn').addEventListener('click', clearTableFilters);

['filter-concept', 'filter-brand', 'filter-area', 'filter-subaccount', 'filter-payment-method', 'filter-type'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('change', () => {
            if (currentPeriodKey) {
                const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
                if (period) {
                    renderMovementTableFromPeriod(period);
                }
            }
        });
        element.addEventListener('input', () => {
            if (currentPeriodKey) {
                const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
                if (period) {
                    renderMovementTableFromPeriod(period);
                }
            }
        });
    }
});

// ========================================
// GENERACIÓN DE PDF
// ========================================

document.getElementById('download-full-table-pdf-btn').addEventListener('click', () => {
    if (!currentPeriodKey) {
        alert('Por favor, seleccione un periodo primero');
        return;
    }
    
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) {
        alert('Periodo no encontrado');
        return;
    }
    
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(14);
    doc.text('Reporte de Movimientos - ' + AppData.companyName, 14, 15);
    doc.setFontSize(10);
    doc.text('Periodo: ' + period.name, 14, 22);
    
    const tableData = [];
    tableData.push(['Fecha', 'Concepto', 'Empresa', 'Area', 'Subcuenta', 'Forma de Pago', 'Tipo', 'Monto', 'Saldo', 'Facturacion', 'Notas']);
    
    let runningBalance = period.initialBalance.bank + period.initialBalance.cash;
    
    // Ordenar movimientos por fecha
    const sortedMovements = [...period.movements].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });
    
    sortedMovements.forEach(movement => {
        const balance = movement.type === 'ingreso' 
            ? runningBalance + movement.amount 
            : runningBalance - movement.amount;
        runningBalance = balance;
        
        const formattedDate = formatDate(movement.date);
        
        let invoicingDisplay = '';
        if (movement.invoicingStatus === 'facturado') {
            invoicingDisplay = 'Facturado: ' + movement.invoiceNumber;
        } else if (movement.invoicingStatus === 'pendiente') {
            invoicingDisplay = 'Pendiente';
        } else if (movement.invoicingStatus === 'sin-factura') {
            invoicingDisplay = 'Sin Factura';
        } else if (movement.invoicingStatus === 'custom-color') {
            invoicingDisplay = movement.customColor;
        }
        
        tableData.push([
            formattedDate,
            movement.concept,
            movement.brand,
            movement.area,
            movement.subaccount,
            movement.paymentMethod,
            movement.type === 'ingreso' ? 'Ingreso' : 'Egreso',
            '$' + movement.amount.toFixed(2),
            '$' + balance.toFixed(2),
            invoicingDisplay,
            movement.notes
        ]);
    });
    
    doc.autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: 30,
        margin: 10,
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
            10: { cellWidth: 30 }
        }
    });
    
    doc.save('Movimientos_' + period.periodKey + '.pdf');
});

document.getElementById('add-summary-filter-btn').addEventListener('click', () => {
    const container = document.getElementById('summary-filters-container');
    const filterId = 'filter-' + Date.now();
    
    const filterDiv = document.createElement('div');
    filterDiv.className = 'summary-filter';
    filterDiv.id = filterId;
    filterDiv.innerHTML = `
        <select class="filter-brand">
            <option value="">Todas las Empresas</option>
            ${AppData.brands.map(b => '<option value="' + b + '">' + b + '</option>').join('')}
        </select>
        <select class="filter-area">
            <option value="">Todas las Areas</option>
            ${AppData.areas.map(a => '<option value="' + a + '">' + a + '</option>').join('')}
        </select>
        <select class="filter-subaccount">
            <option value="">Todas las Subcuentas</option>
            ${AppData.subaccounts.map(s => '<option value="' + s + '">' + s + '</option>').join('')}
        </select>
        <select class="filter-payment">
            <option value="">Todas las Formas de Pago</option>
            ${AppData.paymentMethods.map(p => '<option value="' + p + '">' + p + '</option>').join('')}
        </select>
        <button onclick="document.getElementById('${filterId}').remove()">Eliminar</button>
    `;
    
    container.appendChild(filterDiv);
});

document.getElementById('download-summary-pdf-btn').addEventListener('click', function() {
    if (!currentPeriodKey) {
        alert('Por favor, seleccione un periodo primero');
        return;
    }
    
    const period = AppData.savedPeriods.find(p => p.periodKey === currentPeriodKey);
    if (!period) {
        alert('Periodo no encontrado');
        return;
    }
    
    const filters = Array.from(document.querySelectorAll('.summary-filter')).map(filter => ({
        brand: filter.querySelector('.filter-brand').value,
        area: filter.querySelector('.filter-area').value,
        subaccount: filter.querySelector('.filter-subaccount').value,
        paymentMethod: filter.querySelector('.filter-payment').value
    }));
    
    if (filters.length === 0) {
        alert('Por favor, agregue al menos un filtro para el resumen');
        return;
    }
    
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(14);
    doc.text('Resumen de Movimientos - ' + AppData.companyName, 14, 15);
    doc.setFontSize(10);
    doc.text('Periodo: ' + period.name, 14, 22);
    
    let yPosition = 30;
    
    filters.forEach(function(filter, filterIndex) {
        let filteredMovements = period.movements.filter(m => {
            if (filter.brand && m.brand !== filter.brand) return false;
            if (filter.area && m.area !== filter.area) return false;
            if (filter.subaccount && m.subaccount !== filter.subaccount) return false;
            if (filter.paymentMethod && m.paymentMethod !== filter.paymentMethod) return false;
            return true;
        });
        
        // Ordenar movimientos por fecha
        filteredMovements.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        filteredMovements.forEach(m => {
            if (m.type === 'ingreso') {
                totalIncome += m.amount;
            } else {
                totalExpense += m.amount;
            }
        });
        
        if (yPosition > 240) {
            doc.addPage();
            yPosition = 15;
        }
        
        const filterTitle = 'Empresa: ' + (filter.brand || 'Todas') + ' | Area: ' + (filter.area || 'Todas') + ' | Subcuenta: ' + (filter.subaccount || 'Todas') + ' | Forma de Pago: ' + (filter.paymentMethod || 'Todas');
        doc.setFontSize(10);
        doc.text(filterTitle, 14, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.text('Total Ingresos: $' + totalIncome.toFixed(2), 14, yPosition);
        yPosition += 5;
        doc.text('Total Egresos: $' + totalExpense.toFixed(2), 14, yPosition);
        yPosition += 5;
        doc.text('Neto: $' + (totalIncome - totalExpense).toFixed(2), 14, yPosition);
        yPosition += 8;
        
        if (filteredMovements.length > 0) {
            const tableData = [];
            tableData.push(['Fecha', 'Concepto', 'Empresa', 'Area', 'Subcuenta', 'Forma de Pago', 'Tipo', 'Monto', 'Notas']);
            
            filteredMovements.forEach(movement => {
                const formattedDate = formatDate(movement.date);
                tableData.push([
                    formattedDate,
                    movement.concept,
                    movement.brand,
                    movement.area,
                    movement.subaccount,
                    movement.paymentMethod,
                    movement.type === 'ingreso' ? 'Ingreso' : 'Egreso',
                    '$' + movement.amount.toFixed(2),
                    movement.notes
                ]);
            });
            
            doc.autoTable({
                head: [tableData[0]],
                body: tableData.slice(1),
                startY: yPosition,
                margin: 10,
                styles: { fontSize: 7, cellPadding: 2 },
                columnStyles: {
                    8: { cellWidth: 20 }
                }
            });
            
            yPosition = doc.lastAutoTable.finalY + 10;
        } else {
            doc.setFontSize(9);
            doc.text('No hay movimientos para este filtro', 14, yPosition);
            yPosition += 8;
        }
    });
    
    doc.save('Resumen_' + period.periodKey + '.pdf');
});

window.addEventListener('click', (event) => {
    const editModal = document.getElementById('edit-movement-modal');
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
    
    const initialBalanceModal = document.getElementById('initial-balance-modal');
    if (event.target === initialBalanceModal) {
        initialBalanceModal.style.display = 'none';
    }
    
    const editInitialBalanceModal = document.getElementById('edit-initial-balance-modal');
    if (event.target === editInitialBalanceModal) {
        editInitialBalanceModal.style.display = 'none';
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================

function setupEventListeners() {
    // Event listeners ya configurados en las secciones anteriores
}

document.addEventListener('DOMContentLoaded', initializeApp);
