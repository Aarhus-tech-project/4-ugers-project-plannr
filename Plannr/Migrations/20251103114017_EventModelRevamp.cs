using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plannr.Migrations
{
    /// <inheritdoc />
    public partial class EventModelRevamp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventPageSection");

            migrationBuilder.DropColumn(
                name: "AccessLink",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "AllDay",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CheckedInCount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "GoingCount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "InterestedCount",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Theme_Icon",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Theme_Name",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Venue",
                table: "Events");

            migrationBuilder.RenameColumn(
                name: "RequiredAge",
                table: "Events",
                newName: "Attendance_Interested");

            migrationBuilder.AddColumn<string>(
                name: "Access_Instruction",
                table: "Events",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Access_Password",
                table: "Events",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AgeRestriction",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Attendance_CheckedIn",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Attendance_Going",
                table: "Events",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<JsonDocument>(
                name: "Sections",
                table: "Events",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Themes",
                table: "Events",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Venue",
                table: "EventLocations",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Access_Instruction",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Access_Password",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "AgeRestriction",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Attendance_CheckedIn",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Attendance_Going",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Sections",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Themes",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "Venue",
                table: "EventLocations");

            migrationBuilder.RenameColumn(
                name: "Attendance_Interested",
                table: "Events",
                newName: "RequiredAge");

            migrationBuilder.AddColumn<string>(
                name: "AccessLink",
                table: "Events",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AllDay",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false);

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
                name: "InterestedCount",
                table: "Events",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Theme_Icon",
                table: "Events",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Theme_Name",
                table: "Events",
                type: "character varying(32)",
                maxLength: 32,
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
                    Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    SectionType = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
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
    }
}
