// Create New Todo
$("#newTodo").submit(function(e) {
  e.preventDefault();
  var todoItem = $(this).serialize();
  $.post("/todos", todoItem, data => {
    $("#listTodo").append(
      `
      <li class="list-group-item">
        <form action="/todos/${data._id}" method="POST" id="editTodo">
          <div class="form-group">
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
          </div>
          <button class="btn btn-primary">Update Item</button>
        </form>
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button class="btn btn-sm btn-warning editTodo">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}" id="deleteTodo">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
      </li>
      `
    );
    $("#newTodo")
      .find(".form-control")
      .val("");
  });
});

// Show Edit Todo Form
$("#listTodo").on("click", ".editTodo", function() {
  $(this)
    .parent()
    .siblings("#editTodo")
    .toggle();
});

// Put Edit Todo Form
$("#listTodo").on("submit", "#editTodo", function(e) {
  e.preventDefault();
  let editedTodo = $(this).serialize();
  let editurl = $(this).attr("action");
  $originalItem = $(this).parent(".list-group-item");
  $.ajax({
    url: editurl,
    data: editedTodo,
    type: "PUT",
    originalItem: $originalItem,
    success: function(data) {
      this.originalItem.html(
        `
        <form action="/todos/${data._id}" method="POST" id="editTodo">
          <div class="form-group">
            <label for="${data._id}">Item Text</label>
            <input type="text" value="${data.text}" name="todo[text]" class="form-control" id="${data._id}">
          </div>
          <button class="btn btn-primary">Update Item</button>
        </form>
        <span class="lead">
          ${data.text}
        </span>
        <div class="pull-right">
          <button class="btn btn-sm btn-warning editTodo">Edit</button>
          <form style="display: inline" method="POST" action="/todos/${data._id}">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
          </form>
        </div>
        <div class="clearfix"></div>
        `
      );
    }
  });
});

// Delete Todo
$("#listTodo").on("submit", "#deleteTodo", function(e) {
  e.preventDefault();
  let confirmResponse = confirm("Are you sure?");
  if (confirmResponse === true) {
    let deleteUrl = $(this).attr("action");
    let $originaldeleteItem = $(this).closest(".list-group-item");
    $.ajax({
      url: deleteUrl,
      type: "DELETE",
      originalItem: $originaldeleteItem,
      success: function(data) {
        this.originalItem.remove();
      }
    });
  } else {
    $(this)
      .find("button")
      .blur();
  }
});
