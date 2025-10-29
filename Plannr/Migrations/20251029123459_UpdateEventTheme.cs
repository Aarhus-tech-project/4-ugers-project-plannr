using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plannr.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEventTheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ThemeName",
                table: "Events",
                newName: "Theme_Name");

            migrationBuilder.RenameColumn(
                name: "ThemeIcon",
                table: "Events",
                newName: "Theme_Icon");

            migrationBuilder.AddColumn<string>(
                name: "AccessLink",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CheckedInCount",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GoingCount",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RequiredAge",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Venue",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EventPageSection",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    SectionType = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Latitude = table.Column<decimal>(type: "numeric", nullable: true),
                    Longitude = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventPageSection", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventPageSection_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventPageSection_EventId",
                table: "EventPageSection",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventPageSection");

            migrationBuilder.DropColumn(
                name: "AccessLink",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CheckedInCount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "GoingCount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "RequiredAge",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Venue",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "Theme_Name",
                table: "Events",
                newName: "ThemeName");

            migrationBuilder.RenameColumn(
                name: "Theme_Icon",
                table: "Events",
                newName: "ThemeIcon");
        }
    }
}
