using Microsoft.AspNetCore.Mvc;
using Plannr.Api.Models;
using static Plannr.Helpers.EventHelper;

namespace Plannr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventStore _store;

    public EventsController(IEventStore store) => _store = store;

    // GET /api/events
    [HttpGet]
    public ActionResult<IEnumerable<Event>> GetAll() => Ok(_store.GetEvents());

    // GET /api/events/{id}
    [HttpGet("{id:guid}")]
    public ActionResult<Event> GetById(Guid id)
    {
        var ev = _store.GetEvent(id);
        return ev is null ? NotFound() : Ok(ev);
    }

    // POST /api/events
    [HttpPost]
    public ActionResult<Event> Create([FromBody] Event input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
            return BadRequest("Title is required.");

        if (input.Id == Guid.Empty) input.Id = Guid.NewGuid();

        _store.UpsertEvent(input);
        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }
}