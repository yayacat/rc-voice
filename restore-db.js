const { pool } = require('./database');
const fs = require('fs').promises;

async function restoreDatabase(backupFilePath) {
    let connection;
    try {
        connection = await pool.getConnection();

        console.log(`開始還原資料庫，檔案路徑: ${backupFilePath}`);

        const sqlContent = await fs.readFile(backupFilePath, 'utf8');
        const sqlStatements = sqlContent.split(';');

        console.log(`找到 ${sqlStatements.length - 1} 個 SQL 語句。`);

        await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');
        console.log('已禁用外鍵約束檢查。');

        for (const statement of sqlStatements) {
            const trimmedStatement = statement.trim();
            if (trimmedStatement) {
                console.log(`執行 SQL 語句: ${trimmedStatement.substring(0, 50)}...`); // 僅顯示前 50 個字元
                await connection.execute(trimmedStatement);
            }
        }

        await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('已重新啟用外鍵約束檢查。');

        console.log('資料庫還原完成！');

    } catch (error) {
        console.error('還原資料庫時發生錯誤:', error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// 如果你想在腳本執行時直接指定備份檔案路徑，可以這樣做：
const backupFileToRestore = process.argv[2]; // 從命令列參數取得備份檔案路徑

if (backupFileToRestore) {
    restoreDatabase(backupFileToRestore);
} else {
    console.log('請提供備份檔案路徑作為命令列參數。例如：node restore-db.js ./backups/your_backup.sql');
}