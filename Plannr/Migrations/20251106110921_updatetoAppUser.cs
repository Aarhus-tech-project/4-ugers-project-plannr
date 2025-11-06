using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plannr.Migrations
{
    /// <inheritdoc />
    public partial class updatetoAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_AppUser_UserId",
                table: "Profiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUser",
                table: "AppUser");

            migrationBuilder.RenameTable(
                name: "AppUser",
                newName: "AspNetUsers");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: false,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldNullable: true,
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_AspNetUsers_UserId",
                table: "Profiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_AspNetUsers_UserId",
                table: "Profiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AspNetUsers",
                table: "AspNetUsers");

            migrationBuilder.RenameTable(
                name: "AspNetUsers",
                newName: "AppUser");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "NotInterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "InterestedEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "GoingToEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AlterColumn<List<Guid>>(
                name: "CheckedInEvents",
                table: "Profiles",
                type: "uuid[]",
                nullable: true,
                defaultValueSql: "'{}'::uuid[]",
                oldClrType: typeof(List<Guid>),
                oldType: "uuid[]",
                oldDefaultValueSql: "'{}'::uuid[]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUser",
                table: "AppUser",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_AppUser_UserId",
                table: "Profiles",
                column: "UserId",
                principalTable: "AppUser",
                principalColumn: "Id");
        }
    }
}
