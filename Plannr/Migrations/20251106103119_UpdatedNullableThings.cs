using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plannr.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedNullableThings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //
            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Profiles",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            // 1) Tilføj som NULLABLE først
            migrationBuilder.AddColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true);

            migrationBuilder.AddColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true);

            // 2)
            migrationBuilder.Sql("""
        UPDATE "Profiles" SET "InterestedEvents"='{}'::uuid[] WHERE "InterestedEvents" IS NULL;
        UPDATE "Profiles" SET "GoingToEvents"='{}'::uuid[] WHERE "GoingToEvents" IS NULL;
        UPDATE "Profiles" SET "CheckedInEvents"='{}'::uuid[] WHERE "CheckedInEvents" IS NULL;
        UPDATE "Profiles" SET "NotInterestedEvents"='{}'::uuid[] WHERE "NotInterestedEvents" IS NULL;
    """);

            // 3)
            migrationBuilder.AlterColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValue: new List<Guid>(),
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValue: new List<Guid>(),
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValue: new List<Guid>(),
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true);

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValue: new List<Guid>(),
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn("InterestedEvents", "Profiles");
            migrationBuilder.DropColumn("GoingToEvents", "Profiles");
            migrationBuilder.DropColumn("CheckedInEvents", "Profiles");
            migrationBuilder.DropColumn("NotInterestedEvents", "Profiles");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Profiles",
                type: "uuid",
                nullable: false,
                defaultValue: Guid.Empty,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}