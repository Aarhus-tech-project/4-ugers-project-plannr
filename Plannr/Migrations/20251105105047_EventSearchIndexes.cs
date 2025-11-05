using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plannr.Migrations
{
    /// <inheritdoc />
    public partial class EventSearchIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_EventLocations_Latitude_Longitude",
                table: "EventLocations",
                columns: new[] { "Latitude", "Longitude" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EventLocations_Latitude_Longitude",
                table: "EventLocations");
        }
    }
}
