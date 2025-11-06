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
            migrationBuilder.DropColumn(
                name: "Access_Id",
                table: "Events");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AddColumn<Guid>(
                name: "Access_Id",
                table: "Events",
                type: "uuid",
                nullable: true);
        }
    }
}
