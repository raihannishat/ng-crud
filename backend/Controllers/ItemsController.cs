using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly ItemService _itemService;

    public ItemsController(ItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Item>> GetItems()
    {
        return Ok(_itemService.GetAll());
    }

    [HttpGet("{id}")]
    public ActionResult<Item> GetItem(int id)
    {
        var item = _itemService.GetById(id);
        if (item == null)
            return NotFound();
        return item;
    }

    [HttpPost]
    public ActionResult<Item> PostItem(Item item)
    {
        var created = _itemService.Create(item);
        return CreatedAtAction(nameof(GetItem), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult PutItem(int id, Item item)
    {
        if (id != item.Id)
            return BadRequest();
        if (!_itemService.Update(id, item))
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteItem(int id)
    {
        if (!_itemService.Delete(id))
            return NotFound();
        return NoContent();
    }
}
