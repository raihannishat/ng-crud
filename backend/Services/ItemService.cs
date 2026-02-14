using Backend.Models;

namespace Backend.Services;

public class ItemService
{
    private readonly List<Item> _items = new();
    private int _nextId = 1;
    private readonly object _lock = new();

    public ItemService()
    {
        // Dummy data for the client
        SeedData();
    }

    private void SeedData()
    {
        _items.AddRange(
        [
            new Item { Id = _nextId++, Name = "Sample Item 1", Description = "First dummy item" },
            new Item { Id = _nextId++, Name = "Sample Item 2", Description = "Second dummy item" },
            new Item { Id = _nextId++, Name = "Sample Item 3", Description = "Third dummy item" },
            new Item { Id = _nextId++, Name = "Sample Item 4", Description = "Fourth dummy item" },
            new Item { Id = _nextId++, Name = "Sample Item 5", Description = "Fifth dummy item" }
        ]);
    }

    public IReadOnlyList<Item> GetAll()
    {
        lock (_lock)
        {
            return _items.ToList();
        }
    }

    public Item? GetById(int id)
    {
        lock (_lock)
        {
            return _items.FirstOrDefault(x => x.Id == id);
        }
    }

    public Item Create(Item item)
    {
        lock (_lock)
        {
            item.Id = _nextId++;
            item.Name ??= string.Empty;
            _items.Add(item);
            return item;
        }
    }

    public bool Update(int id, Item item)
    {
        lock (_lock)
        {
            var index = _items.FindIndex(x => x.Id == id);
            if (index < 0) return false;
            item.Id = id;
            _items[index] = item;
            return true;
        }
    }

    public bool Delete(int id)
    {
        lock (_lock)
        {
            var index = _items.FindIndex(x => x.Id == id);
            if (index < 0) return false;
            _items.RemoveAt(index);
            return true;
        }
    }
}
