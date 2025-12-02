using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Plannr.Api.Controllers;
using Plannr.Api.Data;
using Plannr.Api.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.InMemory;

public class CompaniesControllerTests
{
    private ApplicationDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Create_Company_Success()
    {
        var db = GetDbContext();
        var controller = new CompaniesController(db);

        var company = new Company
        {
            Name = "Test Company"
        };

        var result = await controller.Create(company);
        var created = Assert.IsType<CreatedAtActionResult>(result);
        var returnedCompany = Assert.IsType<Company>(created.Value);

        Assert.Equal(company.Name, returnedCompany.Name);
    }

    [Fact]
    public async Task GetById_ReturnsCompany()
    {
        var db = GetDbContext();
        var company = new Company { Id = Guid.NewGuid(), Name = "Comp" };
        db.Companies.Add(company);
        db.SaveChanges();

        var controller = new CompaniesController(db);
        var result = await controller.GetById(company.Id);
        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<Company>(ok.Value);

        Assert.Equal(company.Id, returned.Id);
    }
}