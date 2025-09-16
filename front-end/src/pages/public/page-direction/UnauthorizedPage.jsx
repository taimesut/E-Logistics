import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <Result
                status="403"
                title="403"
                subTitle="Bạn không có quyền truy cập trang này."
                extra={
                    <Button type="primary" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                }
            />
        </div>
    );
};

export default UnauthorizedPage;
