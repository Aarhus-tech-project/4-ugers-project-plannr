using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Controllers;
using Plannr.Api.Data;
using Plannr.Api.Models;
using System;
using System.Threading.Tasks;

public class ProfilesControllerTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Create_Profile_Success()
    {
        var db = GetDbContext();
        var controller = new ProfilesController(db);

        var profile = new Profile
        {
            Email = "test@example.com",
            Name = "Test User"
        };

        var result = await controller.Create(profile);
        var created = Assert.IsType<CreatedAtActionResult>(result);
        var returnedProfile = Assert.IsType<Profile>(created.Value);

        Assert.Equal(profile.Email, returnedProfile.Email);
        Assert.Equal(profile.Name, returnedProfile.Name);
    }

    [Fact]
    public async Task GetById_ReturnsProfile()
    {
        var db = GetDbContext();
        var profile = new Profile { Id = Guid.NewGuid(), Email = "a@b.com", Name = "A" };
        db.Profiles.Add(profile);
        db.SaveChanges();

        var controller = new ProfilesController(db);
        var result = await controller.GetById(profile.Id);
        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Profile>(ok.Value);

        Assert.Equal(profile.Id, returned.Id);
    }
}