using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Controllers;
using Plannr.Api.Data;
using Plannr.Api.Models;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.InMemory;

public class EventsControllerTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAll_ReturnsEvents()
    {
        var db = GetDbContext();
        db.Events.Add(new Event { Id = Guid.NewGuid(), Title = "Event1", Format = "inperson", StartAt = DateTimeOffset.UtcNow });
        db.SaveChanges();

        var controller = new EventsController(db);
        var result = await controller.GetAll();
        var ok = Assert.IsType<OkObjectResult>(result);
        var events = Assert.IsType<List<Event>>(ok.Value);

        Assert.Single(events);
    }

    [Fact]
    public async Task GetById_ReturnsEvent()
    {
        var db = GetDbContext();
        var ev = new Event { Id = Guid.NewGuid(), Title = "Event2", Format = "inperson", StartAt = DateTimeOffset.UtcNow };
        db.Events.Add(ev);
        db.SaveChanges();

        var controller = new EventsController(db);
        var result = await controller.GetById(ev.Id);
        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Event>(ok.Value);

        Assert.Equal(ev.Id, returned.Id);
    }
}