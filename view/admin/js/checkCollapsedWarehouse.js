import User from '../model/user.js'; 
document.addEventListener('DOMContentLoaded', async () => {
    // BUG use this.document instead of document
    const statisticWarehouseHref = document.getElementById('statisticWarehouseHref');
    const supplierHref = document.getElementById('supplierHref');
    const warehouseHref = document.getElementById('warehouseHref');
    const issueHref = document.getElementById('issueHref');
    const invoiceImportHref = document.getElementById('invoiceImportHref');
    const invoiceExportHref = document.getElementById('invoiceExportHref');
    const currentUrl = window.location.href;
    const currentFileName = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    const currentHref = currentFileName.substring(0, currentFileName.lastIndexOf('.')) + 'Href';
    const currentHrefElement = document.getElementById(currentHref);
    const HREF = [statisticWarehouseHref, supplierHref, warehouseHref, issueHref, invoiceImportHref,  invoiceExportHref] ;
    HREF.forEach((element) => {
        if (element !== currentHrefElement) {
            element.classList.add('collapsed');
        }
    });
});