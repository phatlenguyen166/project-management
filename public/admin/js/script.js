// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
// console.log(buttonsStatus);
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    })
}
// End Button Status    

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = document.querySelector('[name="keyword"]').value;

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
// End form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
// console.log(buttonsPagination);

if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            } else {
                url.searchParams.set("page");
            }
            window.location.href = url.href;
        });
    });
}
// End Pagination

// Checkbox Products
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            })
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            })
        }
    });
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length; // lấy ra những input đã check
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox Products

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsdChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn xóa những sản phẩm này?");
            if (!isConfirm) {
                return;
            }
        }


        if (inputsdChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsdChecked.forEach(input => {
                const id = input.value;
                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }

            });

            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một sản phẩm!");
        }
    });
}
// End Form Change Multi

// Restore Many Products
const formRestoreItems = document.querySelector('[form-restore]');
if (formRestoreItems) {
    formRestoreItems.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkBoxRestore = document.querySelectorAll("[checkbox-multi-resstore]");
        const inputsdChecked = checkboxMulti.querySelectorAll("input[name='id-restore']:checked");
        if (inputsdChecked.length > 0) {
            let ids = [];
            const inputIds = formRestoreItems.querySelector("input[name='ids-restore']");
            inputsdChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });
            formRestoreItems.submit();
        } else {
            alert("Vui lòng chọn ít nhất một sản phẩm!");
        }
    })
}
// End Restore Many Products